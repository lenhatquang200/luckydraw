const APP_URL = "http://luckydraw.btec";
var currentPrize, currentPrizeText;
const timestamp = new Date().getTime(); // Get current timestamp

$('#setting').on('click', function() {

});


const passcode = "MTIzYnRlYw=="; // Set your passcode here

// Check if passcode has been entered before
let isPasscodeEntered = localStorage.getItem('isPasscodeEntered') === 'true';

$('#setting').on('click', function() {
    if (!isPasscodeEntered) {
        const userPasscode = prompt("Please enter the passcode:");

        if (btoa(userPasscode) === passcode) {
            isPasscodeEntered = true; // Set flag to true once correct passcode is entered
            localStorage.setItem('isPasscodeEntered', 'true'); // Save status in localStorage
            $('#settingModal').modal('show');
        } else {
            alert("Incorrect passcode.");
        }
    } else {
        $('#settingModal').modal('show');
        if( $('#spinModal').hasClass('show'))
            $('#spinModal').modal('hide');
    }
});


$('#spinModal').on('hidden.bs.modal', function (event) {
    $('#settingModal').modal('show');
});

function loadPrizeSetting() {
    $.ajax({
        url: APP_URL + '/data/prizeSetting.json?t=' + timestamp+Math.random(),
        method: 'GET',
        success: function(data) {
            var prizeSetting = "";
            var prizeSelect = "";
            $('#prizeSelect').empty();
            $.each(data, function(key, value) {
                prizeSetting += value + "\n";
                prizeSelect += `<option value="${key}">${value}</option>`;
            });
            prizeSetting = prizeSetting.trim();
            $('#prizeSetting').val(prizeSetting);
            $('#prizeSelect').append(prizeSelect);
        }
    });
}

$('#saveSetting').on('click', function() {
    savePrizeSetting()
});
function savePrizeSetting()
{
    var prizeSetting = $('#prizeSetting').val().trim();
    $.ajax({
        url: APP_URL + '/data/api.php',
        method: 'POST',
        data: {
            action: 'savePrizeSetting',
            prizeSetting: prizeSetting
        },
        success: function(response) {
            toastr.success("Đã cập nhật giải thưởng");
            loadPrizeSetting();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error saving the data:', textStatus, errorThrown);
        }
    });
}
function loadParticipants(callback) {
    $.ajax({
        url: APP_URL + '/data/participants.json?t=' + timestamp+Math.random(),
        method: 'GET',
        success: function(data) {
            var participants = "";
            $.each(data, function(key, value) {
                participants += value + "\n";
            });
            participants = participants.trim();
            $('#participantSetting').val(participants);
            if (callback) callback();
        }
    });
}

$('#saveParticipants').on('click', function() {
    saveParticipants()
});
function saveParticipants(){
    var participants = $('#participantSetting').val().trim();
    $.ajax({
        url: APP_URL + '/data/api.php',
        method: 'POST',
        data: {
            action: 'saveParticipants',
            participants: participants
        },
        success: function(response) {
            toastr.success("Đã cập nhật Danh sách tham dự");
            loadParticipants(); // Reload participants
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error saving the data:', textStatus, errorThrown);
        }
    });
}
function loadWinners() {
    $.ajax({
        url: APP_URL + '/data/spinResults.json?t=' + timestamp+Math.random(),
        method: 'GET',
        success: function(data) {
            const tableBody = $('#winnersTableBody');
            tableBody.empty();

            $.each(data, function(index, winner) {
                tableBody.append(`
                    <tr data-index="${index}">
                        <td class="text-center">${index + 1}</td>
                        <td class="text-center">${winner.price}</td>
                        <td>${winner.name}</td>
                    </tr>
                `);
            });

            // Attach click event to remove buttons

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading winners:', textStatus, errorThrown);
        }
    });
}
$('#clearResult').on('click', function() {
    $.ajax({
        url: APP_URL + '/data/api.php',
        method: 'POST',
        data: {
            action: 'clearWinners'
        },
        success: function(response) {
            toastr.success("Danh sách trúng thưởng đã được xoá");
            $('#winnersTableBody').empty(); // Clear the table body
            excludedIndexes = []; // Reset the excludedIndexes array
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error clearing the winners list:', textStatus, errorThrown);
        }
    });
});
// $('#specialGift').on('animationend', function() {
//     // do something
//     // $('#specialGift').removeClass('animate__bounceInDown').addClass('animate__tada')
//     alert(123)
// });
const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });
animateCSS('#specialGift', 'bounce').then((message) => {
    // Do something after the animation
    $('#specialGift').removeClass('animate__bounceInDown')
    animateCSS('#specialGift', 'tada')
    animateCSS('#specialGift', 'infinite')
});
