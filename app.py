from flask import Flask, request, jsonify, send_from_directory, session, redirect
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ===============================
# SECURITY
# ===============================

app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key")


# ===============================
# DATABASE CONNECTION
# ===============================

def get_db_connection():
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        return psycopg2.connect(database_url)

    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "datta_pawar_tours"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        port=os.getenv("DB_PORT", "5432")
    )


# ===============================
# LOGIN CHECK
# ===============================

def dashboard_logged_in():
    return session.get("dashboard_logged_in") is True


# ===============================
# HOME
# ===============================

@app.route("/")
def home():
    return send_from_directory(".", "index.html")


# ===============================
# DASHBOARD LOGIN
# ===============================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "GET":
        return send_from_directory(".", "login.html")

    data = request.get_json()

    password = data.get("password", "")

    correct_password = os.getenv("DASHBOARD_PASSWORD", "")

    if password == correct_password:
        session["dashboard_logged_in"] = True

        return jsonify({
            "success": True,
            "message": "Login successful"
        })

    return jsonify({
        "success": False,
        "message": "Invalid password"
    }), 401


# ===============================
# LOGOUT
# ===============================

@app.route("/logout")
def logout():

    session.pop("dashboard_logged_in", None)

    return redirect("/login")


# ===============================
# DASHBOARD
# ===============================

@app.route("/dashboard.html")
def dashboard():

    if not dashboard_logged_in():
        return redirect("/login")

    return send_from_directory(".", "dashboard.html")


# ===============================
# CREATE TABLE
# ===============================

@app.route("/create-table")
def create_table():

    # Only allow owner/dashboard login
    if not dashboard_logged_in():
        return jsonify({
            "success": False,
            "error": "Unauthorized"
        }), 401

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                customer_name VARCHAR(100) NOT NULL,
                mobile VARCHAR(20) NOT NULL,
                pickup VARCHAR(200) NOT NULL,
                drop_location VARCHAR(200) NOT NULL,
                travel_date DATE NOT NULL,
                travel_time TIME NOT NULL,
                vehicle VARCHAR(100) NOT NULL,
                passengers INTEGER NOT NULL,
                instructions TEXT,
                status VARCHAR(30) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()

        cur.close()
        conn.close()

        return "Bookings table created successfully!"

    except Exception as e:

        return f"Error: {str(e)}"


# ===============================
# ADD BOOKING
# PUBLIC API
# ===============================

@app.route("/api/bookings", methods=["POST"])
def add_booking():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "Invalid booking data"
            }), 400

        customer_name = data.get("customer_name")
        mobile = data.get("mobile")
        pickup = data.get("pickup")
        drop_location = data.get("drop")
        travel_date = data.get("travel_date")
        travel_time = data.get("travel_time")
        vehicle = data.get("vehicle")
        passengers = data.get("passengers")
        instructions = data.get("instructions", "")

        # Basic validation
        required_fields = [
            customer_name,
            mobile,
            pickup,
            drop_location,
            travel_date,
            travel_time,
            vehicle,
            passengers
        ]

        if not all(required_fields):

            return jsonify({
                "success": False,
                "error": "Please fill all required fields"
            }), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO bookings
            (
                customer_name,
                mobile,
                pickup,
                drop_location,
                travel_date,
                travel_time,
                vehicle,
                passengers,
                instructions
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (
            customer_name,
            mobile,
            pickup,
            drop_location,
            travel_date,
            travel_time,
            vehicle,
            passengers,
            instructions
        ))

        booking_id = cur.fetchone()[0]

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Booking saved successfully!",
            "booking_id": booking_id
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ===============================
# GET BOOKINGS
# OWNER ONLY
# ===============================

@app.route("/api/bookings", methods=["GET"])
def get_bookings():

    if not dashboard_logged_in():

        return jsonify({
            "success": False,
            "error": "Unauthorized"
        }), 401

    try:

        conn = get_db_connection()

        cur = conn.cursor(
            cursor_factory=RealDictCursor
        )

        cur.execute("""
            SELECT
                id,
                customer_name,
                mobile,
                pickup,
                drop_location,
                travel_date,
                travel_time,
                vehicle,
                passengers,
                instructions,
                status,
                created_at
            FROM bookings
            ORDER BY created_at DESC
        """)

        bookings = cur.fetchall()

        cur.close()
        conn.close()

        for booking in bookings:

            if booking.get("travel_date"):
                booking["travel_date"] = str(
                    booking["travel_date"]
                )

            if booking.get("travel_time"):
                booking["travel_time"] = str(
                    booking["travel_time"]
                )

            if booking.get("created_at"):
                booking["created_at"] = str(
                    booking["created_at"]
                )

        return jsonify(bookings)

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ===============================
# UPDATE BOOKING STATUS
# OWNER ONLY
# ===============================

@app.route(
    "/api/bookings/<int:booking_id>/status",
    methods=["PUT"]
)
def update_booking_status(booking_id):

    if not dashboard_logged_in():

        return jsonify({
            "success": False,
            "error": "Unauthorized"
        }), 401

    try:

        data = request.get_json()

        new_status = data.get("status")

        allowed_statuses = [
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ]

        if new_status not in allowed_statuses:

            return jsonify({
                "success": False,
                "error": "Invalid status"
            }), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            UPDATE bookings
            SET status = %s
            WHERE id = %s
        """, (
            new_status,
            booking_id
        ))

        conn.commit()

        updated = cur.rowcount

        cur.close()
        conn.close()

        if updated == 0:

            return jsonify({
                "success": False,
                "error": "Booking not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Booking status updated successfully!"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ===============================
# SERVE OTHER FILES
# ===============================

@app.route("/<path:filename>")
def serve_files(filename):

    return send_from_directory(".", filename)


# ===============================
# RUN APP
# ===============================

if __name__ == "__main__":
    app.run(debug=True)