$('#spin').on('click', function () {
    $('.spinning').show();
    $('.spinResult').hide();
    $('#startSpin').removeClass('disabled');
    $('#luckynumber').html(' -- -- -- -- -- -- -- ');
    $('#settingModal').modal('hide');
    $('#spinModal').modal('show');
    currentPrize = $('#prizeSelect').val();
    currentPrizeText = currentPrize == "" ? "" : $('#prizeSelect option:selected').text();
    $('.currentPrize').html(currentPrizeText);
    if (currentPrizeText == "") {
        $('.currentPrize').hide();
    } else {
        $('.currentPrize').show();
    }
});

$('#startSpin').on('click', function () {
    loadParticipants(function () {
        startSpinning();
    });
});

$(document).on('click', '#continueSpin', function () {
    $('.spinResult').hide();
    $('.spinning').show();
    $('#luckynumber').html(' -- -- -- -- -- -- -- ');
    $('#startSpin').removeClass('disabled');
});

let initialInterval = 80;
let currentInterval = initialInterval;
let elapsedTicks = 0;
let excludedIndexes = [];
let luckyEntries;
const stopIntervalAfter = 90;
const slowDownIntervalAfter = 80;

function updateLuckyEntries() {
    return $('#participantSetting').val()
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

function startSpinning() {
    $('button').addClass('disabled')
    $('#startSpin').addClass('disabled');
    luckyEntries = updateLuckyEntries(); // Update luckyEntries before starting the spin
    if (typeof luckyEntries == "undefined" || luckyEntries.length == 0) {
        $('#startSpin').removeClass('disabled');
        $('button').removeClass('disabled')
        toastr.error("Chưa thiết lập người tham dự!")
        return;
    }
    if (luckyEntries.length == excludedIndexes.length) {
        toastr.error("Không còn ai để quay số!")
        $('#startSpin').removeClass('disabled');
        $('button').removeClass('disabled')
        return;
    } else {
        intervalId = setInterval(updateLuckyDisplay, currentInterval);
    }
}

function slowDownSpin() {
    currentInterval *= 1.3;
}

function getRandomIndex(excludedIndexes) {
    let index;
    do {
        index = Math.floor(Math.random() * luckyEntries.length);
    } while (excludedIndexes.includes(index));
    return index;
}

function updateLuckyDisplay() {
    const newIndex = getRandomIndex(excludedIndexes);
    document.getElementById("luckynumber").innerHTML = luckyEntries[newIndex];
    elapsedTicks++;

    if (elapsedTicks > slowDownIntervalAfter && elapsedTicks < stopIntervalAfter) {
        clearInterval(intervalId);
        slowDownSpin();
        intervalId = setInterval(updateLuckyDisplay, currentInterval);
    }

    if (elapsedTicks > stopIntervalAfter) {
        clearInterval(intervalId);
        currentInterval = initialInterval;
        elapsedTicks = 0;
        excludedIndexes.push(newIndex); // Add the newly selected index to excludedIndexes
        setTimeout(() => {
            $('button').removeClass('disabled')
            $('#startSpin').removeClass('disabled');
            $('#resultSpin').html(luckyEntries[newIndex])
            $('.spinning').hide();
            $('.spinResult').show();
            if (currentPrizeText == "") {
                $(".spinResult span.text-primary.fs-1, .spinResult b.currentPrize").hide();
            } else {
                $(".spinResult span.text-primary.fs-1, .spinResult b.currentPrize").show();
            }
            storeResult(luckyEntries[newIndex], currentPrizeText)
        }, 600);
    }
}
function storeResult(name, currentPrizeText) {
    const result = {
        name: name,
        price: currentPrizeText
    };

    $.ajax({
        url: APP_URL + '/data/api.php',
        method: 'POST',
        data: {
            action: 'saveSpinResult',
            result: JSON.stringify(result)
        },
        success: function (response) {
            loadWinners()
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Error saving the result:', textStatus, errorThrown);
        }
    });
}
