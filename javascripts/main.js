// Wrap everything in a DOMContentLoaded event listener to ensure the DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function () {

    // Google Analytics snippet
    (function (i, s, o, g, r, a, m) {
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
        };
        i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-37255698-4', 'auto');
    ga('send', 'pageview');

    // Function to calculate age and month difference
    function calculateAgeAndMonthDifference(birthDate, elementIdTimeSpan, elementIdMonthSpan) {
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        let month = currentDate.getMonth() - birthDate.getMonth();
        let day = currentDate.getDate() - birthDate.getDate();

        if (month < 0 || (month === 0 && day < 0)) {
            age--;
            month += 12;
        }

        document.getElementById(elementIdTimeSpan).innerHTML = age;
        if (elementIdMonthSpan) {
            document.getElementById(elementIdMonthSpan).innerHTML = month;
        }
    }

    // Calculate ds_age
    const doJ_ds = new Date("2016-07-15T00:00:00.000+05:30");
    calculateAgeAndMonthDifference(doJ_ds, 'ds_time_span', null);

    // Calculate age and month for main date
    const doJ = new Date("2013-11-15T00:00:00.000+05:30");
    calculateAgeAndMonthDifference(doJ, 'time_span', 'month_span');

    // Theme toggle functionality
    const toggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    toggleButton.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

});
