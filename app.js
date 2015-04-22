$(function(){

	$(".unanswered-getter").submit(function(event){
		//zero out results if previous search has run
		$(".results").html("");
		//get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		console.log(tags);
		getUnansweredTags(tags);
	});

	$(".inspiration-getter").submit(function(event){
		//zero out results if previous search has run//
		$(".results").html("");
		//get the value of the input box 
		var answerers = $("#answerers-input").val();
		console.log(answerers);
		getAnswerers(answerers);
	});
});

var showQuestion = function(question){
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

var showSearchResults = function(query, resultNum){
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

var showError = function(error){
	var errorElem = $('.tamplates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

var getUnansweredTags = function(tags){
	//create object to pass params to ajax call
	var request = {
		order: "desc",
		sort: "activity",
		tagged: tags,
		site: "stackoverflow"
	};

	//pass in the params to the ajax call
	this.request = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);
	
		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item){
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});

};


function getAnswerers(answerers){
	// the parameters we need to pass in our request to StackOverflow
	 var params = {
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation',
		tagged: answerers
	};

	 var result = $.ajax({
		url: 'http://api.stackexchange.com/2.2/questions/unanswered',
		data: params,
		dataType: 'jsonp',
		type: 'GET'
	})
	.done(function(result){
		var searchResults = showSearchResults(params.tagged, result.items.length);
	
		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item){
			var question = showQuestion(item);
			$('.results').append(question);
		})
	})
	.fail(function(){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};