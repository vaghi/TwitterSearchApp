'use strict';

angular.module('myApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope','$window','MyTweeterApp.Services.Search.Service', 'MyTweeterApp.Helpers.DonutChart.Helper', function($scope, $window, SearchService, DonutChartHelper) {

	var vm = $scope;
	
	var donuts;
	var donutTitle = "Followers";

	var errorMsg = "Error executing the search"

	vm.SearchUsers = function(){
		$("body").addClass("loading");

		SearchService.GetTweets(vm.searchKeyword, vm.quantityToShow, vm.OnSearchSuccess, vm.OnSearchError);
	}

	vm.OnSearchSuccess = function(data){
		vm.Tweets = data.statuses;

		if(vm.Tweets.length == 0) {
			$("#donut-charts").addClass("invisible");
			vm.noResultKeyword = vm.searchKeyword;
		} else {
			$("#donut-charts").removeClass("invisible");
			var donutData = getFollowersList(vm.Tweets);

			if(!donuts) {
				donuts = new DonutChartHelper.DonutCharts();	
				donuts.create(donutData);
			} else {
				donuts.update(donutData);
			}
		}

		$("body").removeClass("loading");
	}

	vm.OnSearchError = function(error){
		vm.Tweets = [];
		vm.noResultKeyword = errorMsg;

		$("body").removeClass("loading");
	}

	vm.ShowData = function(){
		return (vm.Tweets && vm.Tweets.length > 0);
	}

	vm.OpenLink = function(url){
		$window.open('https://twitter.com/' + url);
	}

	function getFollowersList(data) {
		var followers = [];
		var duplicateControl = [];
		var total = 0;

		for(var i = 0; i < data.length; i++) {
			if(duplicateControl[data[i].user.screen_name]) {
				continue;
			}

			duplicateControl[data[i].user.screen_name] = true;

			followers.push({
				"cat": "@" + data[i].user.screen_name,
				"val": data[i].user.followers_count
			});
			total += data[i].user.followers_count;
		}

		return [{
			"data": followers,
			"total": total,
			"type": donutTitle,
			"unit": ""
		}];
	}

}]);

$(window).scroll(function() {
	if ($(this).scrollTop() > 1){  
		$('header').addClass("sticky");
	}
	else{
		$('header').removeClass("sticky");
	}
});