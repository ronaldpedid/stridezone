$(document).ready(function () {
    $("#registerPUOpen").click(function () {
        $("#registerPU").show("fast", function () {
        });
    });
});

$(document).ready(function () {
    $(".close").click(function () {
        $("#registerPU").hide("fast", function () {
        });
    });
});