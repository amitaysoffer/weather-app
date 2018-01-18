var userCities = [];

// Deletes the country of the city, leaving the what ever it is behind the comma.
// Created becaues of the google autocomplete
function RemoveCountriesStrFromLocation(full_input) {
    var result = full_input;
    var indexOfFirstComma = full_input.indexOf(",");
    if (indexOfFirstComma > 0) { // Comma exists
        var result = full_input.substring(0, indexOfFirstComma);
    }
    return result;
}

// ajax call to fetch the weather data from the server
function fetch(currentCity) {
    $.ajax({
        method: 'GET',
        url: '/weather/' + RemoveCountriesStrFromLocation(currentCity) + '',
        success: function (data) {
            $(".spinner").hide();
            userCities.push(data);
            console.log(userCities);
            _renderCityTemps(userCities);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

// grab user input of city name
function grabUserData() {
    currentCity = $("#userInput").val();
    $("#userInput").val('');
    $(".spinner").show();
};

// clears the view and initialize handlbars template view
function _renderCityTemps(userCities) {
    $('.postCities').empty();
    var source = $('#store-template').html();
    var template = Handlebars.compile(source);

    // render cities to the view
    userCities.forEach(function (city) {
        var newHTML = template(city);
        $('.postCities').append(newHTML);
    });
}

function createComment(postIndex, newComment) {
    if (newComment) {
        userCities[postIndex].comments.push(newComment);
        renderComments(postIndex);
    }
    else {
        alert('theres no text in yours comment');
    }
}

function renderComments(postIndex) {
    var $comments = $('.comments').eq(postIndex)

    $comments.empty();

    userCities[postIndex].comments.forEach(function (comment) {
        $comments.append('<div class = "row"><div class="postComment col-lg-6">' + comment + '</div></div>');
    });
};

// Add comment
$('.postCities').on('click', '.commentButton', function () {
    var commentText = $(this).offsetParent().siblings('input').val();
    $(this).offsetParent().siblings('input').val('');

    var postIndex = $('.commentButton').index($(this));

    createComment(postIndex, commentText);
});

// use of the "enter" key 
$('#userInput').keypress(function (e) {
    var key = e.which;
    if (key === 13) {
        grabUserData();
        fetch(currentCity);
    };
});

// Search for Temp button activate
$("#search").on('click', function () {
    grabUserData();
    fetch(currentCity);
})

// Google autocomplete 
var userinput = document.getElementById("userInput");
var autocomplete = new google.maps.places.Autocomplete(userinput);