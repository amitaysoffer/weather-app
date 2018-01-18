// var currentCity;
var userCities=[];

 function RemoveCountriesStrFromLocation(full_input) { // NOTE: takes the first city name
    var result = full_input;
    var indexOfFirstComma = full_input.indexOf(",");
    if (indexOfFirstComma > 0) { // Comma exists
      var result = full_input.substring(0, indexOfFirstComma);
    }

    return result;
 }

function fetch(currentCity) {
    $.ajax({
        method:'GET',
        url: '/weather/'+RemoveCountriesStrFromLocation(currentCity)+'',
        success: function (data) {
    
            userCities.push(data);
            console.log(userCities);
            _renderCityTemps(userCities);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}

function grabUserData() {
    currentCity = $("#userInput").val();
    $("#userInput").val('');
    
}

function _renderCityTemps(userCities){
    $('.postCities').empty();
    var source = $('#store-template').html();
    var template = Handlebars.compile(source);
    
    userCities.forEach(function(city){
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
        $comments.append('<div class = "row"><div class="postComment col-lg-6">' + comment + '\
    </div><button class="btn btn-xs btn-danger col-lg-6 glyphicon glyphicon-trash deleteComment"></button></div>');
    });
};

$('.postCities').on('click','.commentButton', function(){
   var commentText = $(this).offsetParent().siblings('input').val();
   $(this).offsetParent().siblings('input').val('');

    var postIndex = $('.commentButton').index($(this));

    createComment(postIndex, commentText);
});


$("#search").on('click', function () {
    grabUserData();
    fetch(currentCity);
})

var userinput = document.getElementById("userInput");
var autocomplete = new google.maps.places.Autocomplete(userinput);