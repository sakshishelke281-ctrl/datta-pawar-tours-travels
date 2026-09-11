document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // BUSINESS DETAILS
    // ===============================

    const BUSINESS_NAME = "Datta Pawar Tours & Travels";
    const BUSINESS_WHATSAPP = "919673984377";
    const BUSINESS_PHONE = "919673984377";
    const BUSINESS_EMAIL = "pawardatta4912@gmail.com";


    // ===============================
    // ELEMENTS
    // ===============================

    const bookingForm = document.getElementById("bookingForm");
    const reviewForm = document.getElementById("reviewForm");
    const vehicleSelect = document.getElementById("vehicle");
    const passengerInput = document.getElementById("passengers");


    // ===============================
    // MOBILE NAVBAR
    // ===============================

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });

        navMenu.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
            });

        });
    }


    // ===============================
    // SMOOTH SCROLL
    // ===============================

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (e) {

            const targetId = this.getAttribute("href");

            if (targetId && targetId !== "#") {

                const target = document.querySelector(targetId);

                if (target) {

                    e.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });


    // ===============================
    // SCROLL PROGRESS
    // ===============================

    const progressBar = document.getElementById("scrollProgress");

    window.addEventListener("scroll", function () {

        if (!progressBar) return;

        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progressBar.style.width = progress + "%";
    });


    // ===============================
    // TYPING ANIMATION
    // ===============================

    const typingElement =
        document.getElementById("typingText");

    if (typingElement) {

        const words = [
            "Trusted Cab Service Across Maharashtra",
            "Airport Pickup & Drop",
            "Comfortable Outstation Travel",
            "Safe & Reliable Cab Service",
            "Corporate & Event Booking"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeEffect() {

            const currentWord = words[wordIndex];

            if (!deleting) {

                typingElement.textContent =
                    currentWord.substring(0, charIndex + 1);

                charIndex++;

                if (charIndex === currentWord.length) {

                    deleting = true;

                    setTimeout(typeEffect, 1800);

                    return;
                }

            } else {

                typingElement.textContent =
                    currentWord.substring(0, charIndex - 1);

                charIndex--;

                if (charIndex === 0) {

                    deleting = false;

                    wordIndex =
                        (wordIndex + 1) % words.length;
                }
            }

            setTimeout(
                typeEffect,
                deleting ? 55 : 90
            );
        }

        typeEffect();
    }


    // ===============================
    // MINIMUM TRAVEL DATE
    // ===============================

    const dateInput =
        document.getElementById("travelDate");

    if (dateInput) {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(today.getDate())
                .padStart(2, "0");

        dateInput.min =
            `${year}-${month}-${day}`;
    }


    // ===============================
    // VEHICLE CAPACITY
    // ===============================

    const vehicleCapacity = {

        "Hyundai Xcent": 4,
        "Swift Dzire": 4,
        "Ertiga": 7,
        "Innova": 7,
        "Tempo Traveller": 17
    };


    // ===============================
    // BOOK THIS VEHICLE BUTTON
    // ===============================

    document.querySelectorAll(".small-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedVehicle =
                this.getAttribute("data-vehicle");

            if (vehicleSelect && selectedVehicle) {

                vehicleSelect.value =
                    selectedVehicle;

                vehicleSelect.dispatchEvent(
                    new Event("change")
                );
            }

            const bookingSection =
                document.getElementById("booking");

            if (bookingSection) {

                bookingSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });


    // ===============================
    // PASSENGER VALIDATION
    // ===============================

    if (passengerInput) {

        passengerInput.addEventListener("input", function () {

            let passengers =
                parseInt(this.value);

            if (passengers > 17) {

                this.value = 17;

                showToast(
                    "Maximum 17 passengers allowed."
                );
            }

            if (passengers < 1 && this.value !== "") {

                this.value = 1;
            }
        });
    }


    // ===============================
    // VEHICLE CHANGE
    // ===============================

    if (vehicleSelect && passengerInput) {

        vehicleSelect.addEventListener(
            "change",
            function () {

                const vehicle =
                    this.value;

                const capacity =
                    vehicleCapacity[vehicle];

                if (!capacity) return;

                passengerInput.max =
                    capacity;

                if (
                    passengerInput.value &&
                    parseInt(passengerInput.value) > capacity
                ) {

                    passengerInput.value =
                        capacity;

                    showToast(
                        `${vehicle} allows maximum ${capacity} passengers.`
                    );
                }
            }
        );
    }


    // ===============================
    // BOOKING FORM
    // ===============================

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            async function (e) {

                e.preventDefault();


                // -------------------------------
                // GET VALUES
                // -------------------------------

                const customerName =
                    document.getElementById("customerName")
                        ?.value.trim();

                const mobile =
                    document.getElementById("mobile")
                        ?.value.trim();

                const pickup =
                    document.getElementById("pickup")
                        ?.value.trim();

                const drop =
                    document.getElementById("drop")
                        ?.value.trim();

                const travelDate =
                    document.getElementById("travelDate")
                        ?.value;

                const travelTime =
                    document.getElementById("travelTime")
                        ?.value;

                const vehicle =
                    document.getElementById("vehicle")
                        ?.value;

                const passengers =
                    document.getElementById("passengers")
                        ?.value;

                const instructions =
                    document.getElementById("instructions")
                        ?.value.trim();


                // -------------------------------
                // BASIC VALIDATION
                // -------------------------------

                if (!customerName) {

                    showToast(
                        "Please enter your name."
                    );

                    return;
                }


                if (!mobile) {

                    showToast(
                        "Please enter your mobile number."
                    );

                    return;
                }


                if (!/^[6-9]\d{9}$/.test(mobile)) {

                    showToast(
                        "Please enter a valid 10-digit mobile number."
                    );

                    return;
                }


                if (!pickup) {

                    showToast(
                        "Please enter pickup location."
                    );

                    return;
                }


                if (!drop) {

                    showToast(
                        "Please enter drop location."
                    );

                    return;
                }


                if (!travelDate) {

                    showToast(
                        "Please select travel date."
                    );

                    return;
                }


                if (!travelTime) {

                    showToast(
                        "Please select travel time."
                    );

                    return;
                }


                if (!vehicle) {

                    showToast(
                        "Please select a vehicle."
                    );

                    return;
                }


                if (!passengers) {

                    showToast(
                        "Please enter number of passengers."
                    );

                    return;
                }


                const passengerCount =
                    parseInt(passengers);


                if (
                    isNaN(passengerCount) ||
                    passengerCount < 1
                ) {

                    showToast(
                        "Please enter a valid passenger count."
                    );

                    return;
                }


                // -------------------------------
                // VEHICLE CAPACITY
                // -------------------------------

                const capacity =
                    vehicleCapacity[vehicle];

                if (
                    capacity &&
                    passengerCount > capacity
                ) {

                    showToast(
                        `${vehicle} allows maximum ${capacity} passengers.`
                    );

                    return;
                }


                // -------------------------------
                // FUTURE DATE/TIME CHECK
                // -------------------------------

                const selectedDateTime =
                    new Date(
                        `${travelDate}T${travelTime}`
                    );

                const now =
                    new Date();

                if (
                    isNaN(selectedDateTime.getTime()) ||
                    selectedDateTime <= now
                ) {

                    showToast(
                        "Please select a future travel date and time."
                    );

                    return;
                }


                // -------------------------------
                // SEND TO BACKEND
                // -------------------------------

                const bookingData = {

                    customer_name: customerName,
                    mobile: mobile,
                    pickup: pickup,
                    drop: drop,
                    travel_date: travelDate,
                    travel_time: travelTime,
                    vehicle: vehicle,
                    passengers: passengerCount,
                    instructions: instructions
                };


                try {

                    const response =
                        await fetch(
                            "/api/bookings",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        bookingData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.error ||
                            "Booking failed."
                        );
                    }


                    // -------------------------------
                    // WHATSAPP MESSAGE
                    // -------------------------------

                    const whatsappMessage =

`🚕 *New Booking Request*

*Customer Details*
Name: ${customerName}
Mobile: ${mobile}

*Trip Details*
Pickup: ${pickup}
Drop: ${drop}
Travel Date: ${travelDate}
Travel Time: ${travelTime}

Vehicle: ${vehicle}
Passengers: ${passengerCount}

Special Instructions:
${instructions || "None"}

*Datta Pawar Tours & Travels*`;


                    const whatsappURL =
                        `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(
                            whatsappMessage
                        )}`;


                    window.open(
                        whatsappURL,
                        "_blank"
                    );


                    showToast(
                        "Booking saved! Opening WhatsApp..."
                    );


                    bookingForm.reset();


                    // Reset passenger max
                    if (passengerInput) {

                        passengerInput.max = 17;
                    }


                } catch (error) {

                    console.error(
                        "Booking Error:",
                        error
                    );


                    showToast(
                        "Booking could not be saved. Please try again."
                    );
                }
            }
        );
    }


    // ===============================
    // REVIEWS
    // ===============================

    const savedReviews =
        JSON.parse(
            localStorage.getItem(
                "dattaPawarReviews"
            ) || "[]"
        );


    function displayReviews() {

        const reviewsList =
            document.getElementById(
                "reviewsList"
            );

        if (!reviewsList) return;


        if (savedReviews.length === 0) {

            return;
        }


        reviewsList.innerHTML = "";


        savedReviews.forEach(
            function (review) {

                const reviewCard =
                    document.createElement("div");

                reviewCard.className =
                    "review-card";


                const stars =
                    "⭐".repeat(
                        Number(review.rating)
                    );


                reviewCard.innerHTML = `

                    <div class="review-stars">
                        ${stars}
                    </div>

                    <h3>
                        ${escapeHTML(review.name)}
                    </h3>

                    <p>
                        ${escapeHTML(review.text)}
                    </p>

                `;


                reviewsList.appendChild(
                    reviewCard
                );
            }
        );
    }


    displayReviews();


    if (reviewForm) {

        reviewForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const reviewName =
                    document.getElementById(
                        "reviewName"
                    )?.value.trim();


                const rating =
                    document.getElementById(
                        "rating"
                    )?.value;


                const reviewText =
                    document.getElementById(
                        "reviewText"
                    )?.value.trim();


                if (!reviewName) {

                    showToast(
                        "Please enter your name."
                    );

                    return;
                }


                if (!rating) {

                    showToast(
                        "Please select a rating."
                    );

                    return;
                }


                if (!reviewText) {

                    showToast(
                        "Please write your review."
                    );

                    return;
                }


                const review = {

                    name: reviewName,
                    rating: rating,
                    text: reviewText
                };


                savedReviews.push(
                    review
                );


                localStorage.setItem(
                    "dattaPawarReviews",
                    JSON.stringify(
                        savedReviews
                    )
                );


                displayReviews();


                reviewForm.reset();


                showToast(
                    "Thank you for your review!"
                );
            }
        );
    }


    // ===============================
    // ESCAPE HTML
    // ===============================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;
    }


    // ===============================
    // CONTACT ACTIONS
    // ===============================

    const callLinks =
        document.querySelectorAll(
            'a[href^="tel:"]'
        );


    callLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                console.log(
                    "Calling Datta Pawar Travels"
                );
            }
        );
    });


    const whatsappLinks =
        document.querySelectorAll(
            'a[href*="wa.me"]'
        );


    whatsappLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                console.log(
                    "Opening WhatsApp"
                );
            }
        );
    });


    // ===============================
    // TOAST
    // ===============================

    function showToast(message) {

        const toast =
            document.getElementById(
                "toast"
            );

        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        if (!toast || !toastMessage) {

            alert(message);

            return;
        }


        toastMessage.textContent =
            message;


        toast.classList.add(
            "show"
        );


        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );
    }


    // ===============================
    // BACK TO TOP
    // ===============================

    const backToTop =
        document.getElementById(
            "backToTop"
        );


    if (backToTop) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 400) {

                    backToTop.classList.add(
                        "show"
                    );

                } else {

                    backToTop.classList.remove(
                        "show"
                    );
                }
            }
        );


        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"
                });
            }
        );
    }


    // ===============================
    // SCROLL REVEAL
    // ===============================

    const revealElements =
        document.querySelectorAll(
            ".section, .vehicle-card, .service-card, .route-card, .review-card, .contact-card"
        );


    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );
                        }
                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        function (element) {

            revealObserver.observe(
                element
            );
        }
    );


    // ===============================
    // ACTIVE NAVBAR
    // ===============================

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    window.addEventListener(
        "scroll",
        function () {

            let currentSection = "";


            sections.forEach(
                function (section) {

                    const sectionTop =
                        section.offsetTop - 150;

                    const sectionHeight =
                        section.offsetHeight;

                    if (
                        window.scrollY >= sectionTop &&
                        window.scrollY <
                        sectionTop + sectionHeight
                    ) {

                        currentSection =
                            section.getAttribute(
                                "id"
                            );
                    }
                }
            );


            navLinks.forEach(
                function (link) {

                    link.classList.remove(
                        "active"
                    );


                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        href ===
                        `#${currentSection}`
                    ) {

                        link.classList.add(
                            "active"
                        );
                    }
                }
            );
        }
    );


    // ===============================
    // NAVBAR SCROLL EFFECT
    // ===============================

    const navbar =
        document.getElementById(
            "navbar"
        );


    if (navbar) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 50) {

                    navbar.classList.add(
                        "scrolled"
                    );

                } else {

                    navbar.classList.remove(
                        "scrolled"
                    );
                }
            }
        );
    }


    // ===============================
    // CURRENT YEAR
    // ===============================

    const currentYear =
        document.getElementById(
            "currentYear"
        );


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }


    // ===============================
    // CONSOLE
    // ===============================

    console.log(
        "Datta Pawar Tours & Travels website loaded successfully."
    );

});