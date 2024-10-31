export function printCountdown(id:any, endDate:any) {
    // Set the date we're counting down to
    var countDownDate = new Date(endDate).getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;
        var el:any = document.getElementById(id);
        if (now <= countDownDate) {

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, "0");
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0");
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
            var seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, "0");

            if (el) {
                el.disabled = true;
                el.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
            }
        }

    }, 1000);
}