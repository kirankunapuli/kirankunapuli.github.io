document.addEventListener('DOMContentLoaded', function () {

    // Google Analytics snippet
    (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-XXXX');

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
    const doJ_ds = new Date("2016-07-01T00:00:00.000+05:30");
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
