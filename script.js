$(document).ready(loadSource);

//Load demo data.
function loadSource()
{
	$.get("data.html", function(data)
	{
		retrieveData(data);
	}, 'html');

//Declared outside a function for global accessibility.
var calendarElements = new Array();

//This is where the calendar render begins. The data is retrieved by scanning the rendered HTML.
function retrieveData(data)
	{
		//Each data set was tagged with this class, so that it can be discovered by the calendaring program.
		$(data+".changeData").each(function()
		{
			//Each record is tagged with this class so that it can be retrieved by the calendaring program.
			$(this).find("div.changeRecord").each(function(index, element)
			{

				if($(this).find('.REQUEST_NUMBER').html()=="0")
				{
					return false;
				}

				if(element != null)
					{
						var tmpReqNum = $(this).find('.REQUEST_NUMBER').html();
						calendarElements[tmpReqNum] = new Array();
						calendarElements[tmpReqNum]['includeMe'] = true;
						calendarElements[tmpReqNum]['REQUEST_NUMBER'] = $(this).find('.REQUEST_NUMBER').html();
						calendarElements[tmpReqNum]['COMMENT'] = $(this).find('.COMMENT').text();
						calendarElements[tmpReqNum]['TYPE_OF_CHANGE'] = $(this).find('.TYPE_OF_CHANGE').html();
						calendarElements[tmpReqNum]['DESCRIPTION'] = $(this).find('.DESCRIPTION').html();
						calendarElements[tmpReqNum]['SHORT_DESCRIPTION'] = String($(this).find('.SHORT_DESCRIPTION').html());
						calendarElements[tmpReqNum]['STATUS'] = $(this).find('.STATUS').html();
						calendarElements[tmpReqNum]['REQUESTING_PERSON'] = $(this).find('.REQUESTING_PERSON').html();
						calendarElements[tmpReqNum]['SOLUTION_DATE'] = $(this).find('.SOLUTION_DATE').html();
						calendarElements[tmpReqNum]['CLOSURE_CODE'] = $(this).find('.CLOSURE_CODE').html();

						var tmpString = $(this).find('.SERVICE_OWNER').html();
						calendarElements[tmpReqNum]['SERVICE_OWNER'] = tmpString.toString().substring(0, tmpString.length-17).replace('&amp;', 'and');

							function isDateFieldEmpty(val)
							{
							return (val == undefined || val == null || val.length <= 0 || val ==0) ? true : false;
							}
							//Check if End Date is set. If not, set it to 0
							if(isDateFieldEmpty($(this).find('.SOLUTION_DATE').html()))
							{
								calendarElements[tmpReqNum]['SOLUTION_DATE'] = 0;

							}
							else
							{
								//This passes the string to the Date parser, so that it can be stored in a proper JavaScript Date object, and analyzed + calendarized.
								calendarElements[tmpReqNum]['SOLUTION_DATE'] = new Date(formatAndReturnDate($(this).find('.SOLUTION_DATE').html()));
							}

							//Start Date
							if(isDateFieldEmpty($(this).find('.REQUESTED_START_DATE').html()))
							{
								calendarElements[tmpReqNum]['REQUESTED_START_DATE'] = 0;
							}
							else
							{
								calendarElements[tmpReqNum]['REQUESTED_START_DATE'] = new Date(formatAndReturnDate($(this).find('.REQUESTED_START_DATE').html()));
							}

							//End Date
							if(isDateFieldEmpty($(this).find('.REQUESTED_END_DATE').html()))
							{
								calendarElements[tmpReqNum]['REQUESTED_END_DATE'] = 0;
							}
							else
							{
								calendarElements[tmpReqNum]['REQUESTED_END_DATE'] = new Date(formatAndReturnDate($(this).find('.REQUESTED_END_DATE').html()));
							}

							//Planned Start
							if(isDateFieldEmpty($(this).find('.PLANNED_START_DATE').html()))
							{
								calendarElements[tmpReqNum]['PLANNED_START_DATE'] = 0;
							}
							else
							{
								calendarElements[tmpReqNum]['PLANNED_START_DATE'] = new Date(formatAndReturnDate($(this).find('.PLANNED_START_DATE').html()));
							}

							//Planned End
							if(isDateFieldEmpty($(this).find('.PLANNED_END_DATE').html()))
							{
								calendarElements[tmpReqNum]['PLANNED_END_DATE'] = 0;
							}
							else
							{
								calendarElements[tmpReqNum]['PLANNED_END_DATE'] = new Date(formatAndReturnDate($(this).find('.PLANNED_END_DATE').html()));
							}
							return true;
					}
					else
					{

							return false;
					}

			});
		});

		renderCalendar(calendarElements);
	}

function formatAndReturnDate(input)
	{

		//Dates are input in this format... 29/07/2018 8:00:00 am
		var hour, minutes, seconds = 0;

		a = input.toString().split("/"); //a[0] is day, a[1] is month, a[2] is year + remainder of text.

		if(typeof a[2] !== 'undefined')
			{
				b = a[2].split(" "); //b[0] is year. b[1] is 8:00, b[2] is am or pm
				var year = parseInt(b[0]);
			}
		else
			{
				return null
			}


		if(typeof a[1] !== 'undefined')
			{
				var month = parseInt(a[1])-1; //if month is defined, then month = month-1.
			}
		else
			{
				return null;
			}

		if(typeof b[1] !== 'undefined')
			{
				c = b[1].split(":"); //c[0] is 8, c[1] is 00, c[2] is 00 + remainder of text.
			}
		else
			{
				return null;
			}


		if(typeof a[0] !== 'undefined')
			{
				var day = parseInt(a[0]);
			}
		else
			{
				return null;
			}

		if(typeof c[0] !== 'undefined')
			{
				var hour = parseInt(c[0]);
				if (b[2].toLowerCase() == "pm" && hour != 12)
				{
					hour +=12;
				}
			}
		if(typeof c[1] !== 'undefined')
			{
				var minutes = parseInt(c[1]);
			}
		if(typeof c[2] !== 'undefined')
			{
				var seconds = parseInt(c[2]);
			}


		output = new Date(year, month, day, hour, minutes, seconds);
		return output;
	}


function getSortedKeys(obj)
	{
    var keys = [];
		for(var key in obj) keys.push(key);
    return keys.sort();
	}

function renderCalendar(calendarElements)
{

	var sortedKeys = getSortedKeys(calendarElements);
	var sortedCalendar = [];

	$.each(sortedKeys, function(index, value)
	{
		sortedCalendar[value] = calendarElements[value];
	});

    clearCalendar();
    var fullWeek = 6;
    var millisecondtoDays = (60*60*24*1000);

	/*This is set with a static value to work with the demo data. In a producton environment, this would likely be set to today, by creating a new date object. date = new Date(); */
	date = new Date("2018", "06", "07");

	//Today - 10 days.
	startDate = new Date();
	startDate.setTime(date.getTime()-(10*millisecondtoDays));

	//Today + 10 days.
	endDate = new Date();
	endDate.setTime(endDate.getTime()+(10*millisecondtoDays));

	$("#StartDateForCalendar").html(startDate.toString().substring(4,15));
	$("#EndDateForCalendar").html(endDate.toString().substring(4,15));

	//Determine how many days to draw in the calendar.
  var datediff = endDate.getTime() - startDate.getTime();
  var numberOfDays = (datediff / (millisecondtoDays));
	var focusDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	$("#calendarStart").append("<TR><TH>Sunday</TH><TH>Monday</TH><TH>Tuesday</TH><TH>Wednesday</TH><TH>Thursday</TH><TH>Friday</TH><TH>Saturday</TH></TR>");

	var calendarHTML = "";

    for(i=0; i<=numberOfDays; i++)
        {
        var focusDayofWeek = focusDate.getDay()+1; //Returns the day of the week (from 0-6).
        var focusDayofMonth = focusDate.getMonth()+1; //Returns the month (from 0-11)
        var focusYear = focusDate.getFullYear();	//Returns the year.
        var focusDay = focusDate.getDate(); //Returns the day of the month (from 1-31)

		/*Ideally, these bookend variables would not be necessary. They exist becuase if an HTML row is left open while the remainder of the content is being. generated, most modern browsers will automatically close the <TR> tags.	Because of this, we have to keep all of the HTML in a string until it is ready, and then append it at once to the DOM.*/
		var bookEndFr = "";
		var bookEndBa = "";
		var extraClass = "";

			if(i==0)
			{
				var j = focusDayofWeek-1;
				{
						bookEndFr ="<tr class='week'>";

					for(k=0; k<j; k++)
						{
							bookEndFr += "<td></td>";
						}
				}
			}
			if(focusDayofWeek==1 && i !=0 )
				{
					bookEndFr ="<tr class='week'>";

					if(numberOfDays%7!=0 && i<7)
					{
						extraClass = "secondWeek";
					}
				}

			if(focusDayofWeek==7 || i ==numberOfDays)
			{
				bookEndBa = "</tr>";
			}
			var tmpDate = new Date();
			var string1 = focusDate.getFullYear()+"-"+focusDate.getMonth()+"-"+focusDate.getDate();
			var string2 = tmpDate.getFullYear()+"-"+tmpDate.getMonth()+"-"+tmpDate.getDate();
			if(string1 == string2)
			{
				extraClass += " highlightToday";
			}

			calendarHTML += bookEndFr+
				"<td class = 'dayOfWeekCell " + extraClass +"' id ='day"+    (i+1) +"'>"
					+"<p class='CalendarDate'>"+
					+focusDayofMonth+ "-" + focusDay + "-" + focusYear
					+"</p>"+
					getTodaysEvents(sortedCalendar, focusDate) +
				"</td>"+ bookEndBa;

		focusDate.setTime(focusDate.getTime()+(millisecondtoDays));
        }
		$("#calendarStart").append(calendarHTML);


// 	Establishing checkbox controls for Change Type:

//Attempt to get the checkbox values from local storage. If they are not set, create the local storage item.
		var $checkboxesType = $("#checkbox-container :checkbox");
		var checkboxValuesType = JSON.parse(localStorage.getItem('checkboxValuesType'));
			if (checkboxValuesType === null)
			{
				checkboxValuesType = {};

				//If they are not in local storage, also set them all to checked = true.
				$checkboxesType.each(function()
					{
						$(this).prop("checked", true);
						checkboxValuesType[this.id] = true;
						localStorage.setItem("checkboxValuesType", JSON.stringify(checkboxValuesType));
					});
			}
//Load the local storage when the page loads, and set the check-statuses accordingly.
		$.each(checkboxValuesType, function(key, value) {
			$("#" + key).prop('checked', value); //This set the checkboxes to whatever the local storage recalled.
		});

// 	Establishing Checkbox controls for Statuses:

		//Get the checkbox values. If they are not set, create the local storage item.
		var $checkboxesStatus = $("#checkbox-container-status :checkbox");
		var checkboxValuesStatus = JSON.parse(localStorage.getItem('checkboxValuesStatus'));
			if (checkboxValuesStatus === null)
			{
				checkboxValuesStatus = {};
				$checkboxesStatus.each(function()
					{
						//Set the values to true.
						$(this).prop("checked", true);
						checkboxValuesStatus[this.id] = true;
						localStorage.setItem("checkboxValuesStatus", JSON.stringify(checkboxValuesStatus));
					});
			}
		//Load the local storage when the page loads, and set the check status accordingly.
		$.each(checkboxValuesStatus, function(key, value) {
			$("#" + key).prop('checked', value); //This set the checkboxes to whatever the local storage recalled.
		});

//Checkbox controls for Services.
//First, determine what unique services are in the array of changes...
		var uniqueServices = [];
		var duplicateServices = [];

		$.each(Object.keys(calendarElements), function()
		{
			var tmpSrvOwner = calendarElements[this]['SERVICE_OWNER'];
			if(!duplicateServices[tmpSrvOwner])
			{
				var tmpString = calendarElements[this]['SERVICE_OWNER'];
				duplicateServices[tmpString]= true;
				tmpString.replace(/\s/g, '');
				uniqueServices.push(tmpString);
			}
		});

//Sort the services alphabetically, and then render a checkbox for each unique Service.
		uniqueServices.sort();
		var servicesCheckBoxesHTML = "";
		$(uniqueServices).each(function()
		{
			servicesCheckBoxesHTML += "<div>";
			servicesCheckBoxesHTML += "<input type='checkbox' id='" + this.replace(/\s/g, '') +"Toggle'>";
			servicesCheckBoxesHTML += "<label for='" + this.replace(/\s/g, '') +"Toggle'>"+ this +"</label>";
			servicesCheckBoxesHTML += "</div>";
		});

		//Insert the HTML into the appropriate checkbox container.
		$("#checkbox-container-service").html(servicesCheckBoxesHTML);

//Attempt to get the checkbox values local storage. If they are not set, create the local storage item.
		var $checkboxesService = $("#checkbox-container-service :checkbox");
		var checkboxValuesService = JSON.parse(localStorage.getItem('checkboxValuesService'));
			if (checkboxValuesService === null)
			{
				checkboxValuesService = {};

				//If they are not in local storage, set them all to true and store these values.
				$checkboxesService.each(function()
					{
						$(this).prop("checked", true);
						checkboxValuesService[this.id] = true;
						localStorage.setItem("checkboxValuesService", JSON.stringify(checkboxValuesService));
					});
			}
		//Load the local storage when the page loads, and set the check status accordingly.
		$.each(checkboxValuesService, function(key, value) {
			$("#" + key).prop('checked', value); //This set the checkboxes to whatever the local storage recalled.
		});

		//Run the visibility evaluator.
		visibilityEvaluator();

		//Bind checkbox event handlers.
		$checkboxesType.on("change", function(){
			$checkboxesType.each(function(){
				checkboxValuesType[this.id] = this.checked;
				localStorage.setItem("checkboxValuesType", JSON.stringify(checkboxValuesType));
			});
			visibilityEvaluator();
		});
		$checkboxesStatus.on("change", function(){
			$checkboxesStatus.each(function(){
				checkboxValuesStatus[this.id] = this.checked;
				localStorage.setItem("checkboxValuesStatus", JSON.stringify(checkboxValuesStatus));
			});
			visibilityEvaluator();
		});
		$checkboxesService.on("change", function(){
			$checkboxesService.each(function(){
				checkboxValuesService[this.id] = this.checked;
				localStorage.setItem("checkboxValuesService", JSON.stringify(checkboxValuesService));
			});
			visibilityEvaluator();
		});

/*This could be bound elsewhere, so long as it it bound before users attempt to share items via email. Basically, when they check a box on a calendar item, and then press the email button, the contents of that item are retreived from the calendarElements array and sent to their defaault email client.*/
			$("#shareSelectedChanges").on("click", function(){

					var emailContents ="";
					$("input.showMoreDetails").each(function(){
							if($(this).prop('checked')==true)
							{
								emailContents += "Req Num: " + calendarElements[$(this).attr('reqNum')]['REQUEST_NUMBER'] + "\n";
								emailContents += "Type: " + calendarElements[$(this).attr('reqNum')]['TYPE_OF_CHANGE']+ "\n";
								emailContents += "Status: " + calendarElements[$(this).attr('reqNum')]['STATUS']+ "\n";
								emailContents += calendarElements[$(this).attr('reqNum')]['CLOSURE_CODE'].length > 0 ? "Result: " + calendarElements[$(this).attr('reqNum')]['CLOSURE_CODE'] + "\n" : "";
								emailContents += "Comment: " + calendarElements[$(this).attr('reqNum')]['COMMENT']+ "\n";
								emailContents += "Desc: " + calendarElements[$(this).attr('reqNum')]['DESCRIPTION']+ "\n";
								emailContents += calendarElements[$(this).attr('reqNum')]['PLANNED_START_DATE'].length > 0 ? "Planned Start: " + calendarElements[$(this).attr('reqNum')]['PLANNED_START_DATE']+ "\n": "";
								emailContents += calendarElements[$(this).attr('reqNum')]['PLANNED_END_DATE'].length > 0 ? "Planned End: " + calendarElements[$(this).attr('reqNum')]['PLANNED_END_DATE']+ "\n": "";
								emailContents += "Req Start: " + calendarElements[$(this).attr('reqNum')]['REQUESTED_START_DATE']+ "\n";
								emailContents += "Req End: " + calendarElements[$(this).attr('reqNum')]['REQUESTED_END_DATE']+ "\n";
								emailContents += "Requestor: " + calendarElements[$(this).attr('reqNum')]['REQUESTING_PERSON']+ "\n";
								emailContents += "Short Desc: " + calendarElements[$(this).attr('reqNum')]['SHORT_DESCRIPTION']+ "\n";
								emailContents += calendarElements[$(this).attr('reqNum')]['SOLUTION_DATE'].length > 0 ? "Closed: " + calendarElements[$(this).attr('reqNum')]['SOLUTION_DATE'] + "\n" : "";
								emailContents += "\n";
							}
					});

				var email = '';
				var subject = 'Change Requests';
				//Outlook limits this to something like 2048 characters. So, this is based on Outlook because it is one of the most
				//popular desktop email clients.
				var numOfAllowedChars = 2000;
				var emailContentType = "text/html";
				emailFullLink = encodeURI("mailto:" + email+ "?Content-type=" +emailContentType+ '?subject=' + subject + '&body=' +   emailContents);

				//62 characters is the length of the link before selecting anything to share.
				if(emailFullLink.length<=62)
				{
						alert("Please Select Something.");
				}
				else if(emailFullLink.length>numOfAllowedChars)
				{
						alert("Please select fewer items. Number of characters ("+	emailFullLink.length	+") exceeds email client limits ("+numOfAllowedChars+" chars allowed)");
				}
				else {
						window.location = emailFullLink;
				}
			});
		}
}

function visibilityEvaluator()
{
	//Get the checkbox values for filter criteria.
	var checkServices = $("#checkbox-container-service :checkbox");
	var checkStatuses = $("#checkbox-container-status :checkbox");
	var checkTypes = $("#checkbox-container :checkbox");

	trueStatuses = [];
	trueTypes= [];
	trueServices = [];

	//Determine which checkboxes are 'true'
	$(checkTypes).each(function(){
		if(this.checked==true)
		{
		trueTypes.push(this.id.slice(0,-6)+"Change");
		}
	});

	$(checkStatuses).each(function(){
		if(this.checked==true)
		{
		trueStatuses.push(this.id.slice(0,-6));
		}
	});

	$(checkServices).each(function(){
		if(this.checked==true)
		{
		trueServices.push(this.id.slice(0,-6));
		}
	});

//Iterate over the change entry items on the page. For each item, determine which classes it has.
	$(".ChangeEntry").each(function(){

		var classList = this.className.split(' ');
		var thisType = 	classList[1].toString();
		var thisService = classList[2].toString();
		var thisStatus = classList[3].toString();

/*Compare the classes of the change entry with the true checkbox values, and set it's visibility accordingly. For an item to display, it must meet all of the criteria!
*/
		if(trueTypes.indexOf(thisType)>=0 && trueServices.indexOf(thisService)>=0 && trueStatuses.indexOf(thisStatus)>=0)
		{
				$(this).show();
		}
		else
		{
				$(this).hide();
				/*The following unchecks the share boxes when elements are filtered out of view. The purpose of this is to prevent users from filtering items out of view, and then pressing the share button, and inadvertently sharing items they did not wish to share. This would be frustrating for users, because they would not be able to locate the checked box and uncheck it. We handle this scenario here by unchecking hidden boxes for them.
				*/
				$(this).find("input.showMoreDetails").each(function(){
						$(this).prop('checked', false);
					});
		}

	});
}

//This function clears the calendar. This runs as the first step each time the calendar is rendered.
function clearCalendar()
{
$("TBODY#calendarStart").html("");
}

//Evaluates dates to determine if they are valid Date() objects.
function isEmpty(val)
{
	return (val == undefined || val == null || val.length <= 0 || Object.prototype.toString.call(val) !== '[object Date]') ? true : false;
}

//As each calendar day is rendered, the array of calendar items is evaluated to determine what changes could potentially
//affect the day being rendered (focusDay).
function getTodaysEvents(sortedCalendar, focusDate)
{

		var millisecondtoDays = (60*60*24*1000);

		//The cutoffs for what affects each day is midnight today (focusDate) =>midnight tomorrow (tomorrowDate).
		var tomorrowDate = new Date(focusDate.getTime()+millisecondtoDays);

		//This string will hold all the HTML until the render engine is finished.
		var HTMLforThisDay = "<DIV>";
		durationOfEvent = 0; //Flags used later. durationOfEvent 0: St<Today, End=Today; | 1: St<Today, End>Today;  | 2: St=Today, End=Today;  | 3: St=today end>today.  |  4: St<Today, End>Today;  | 9:
							//Not added.

		$.each(Object.keys(sortedCalendar), function()
		{

			//Set default values to null, and assign actual values later if they exist. These variables exist only to use for
			//substitution & readibility in the date evaluations.
			plannedStart = null;
			plannedEnd = null;
			reqStart = null;
			reqEnd = null;
			solutionDate = null;

			//Assigning values, if the exist.
				if(!isEmpty(sortedCalendar[this]['SOLUTION_DATE']))
					{	solutionDate = new Date(sortedCalendar[this]['SOLUTION_DATE']);		}

				if(!isEmpty(sortedCalendar[this]['PLANNED_START_DATE']))
					{	plannedStart = new Date(sortedCalendar[this]['PLANNED_START_DATE']);	}

				if(!isEmpty(sortedCalendar[this]['PLANNED_END_DATE']))
					{	plannedEnd = new Date(sortedCalendar[this]['PLANNED_END_DATE']);		}

				if(!isEmpty(sortedCalendar[this]['REQUESTED_START_DATE']))
					{	reqStart = new Date(sortedCalendar[this]['REQUESTED_START_DATE']);	}

				if(!isEmpty(sortedCalendar[this]['REQUESTED_END_DATE']))
					{	reqEnd = new Date(sortedCalendar[this]['REQUESTED_END_DATE']);		}

/*The order of precedence for dates in change management with regards for calendaring purposes is that solution dates are the most important because they are completed changes. Next is planned changes, because these are Normal changes and have been planned by a change manager. Finally, requested dates, because they are for non-Normal changes, and changes that are still in play.*/

			if(!isEmpty(solutionDate) && sortedCalendar[this]['includeMe'] == true)
			{
				if(solutionDate.getTime()>focusDate.getTime() && solutionDate.getTime()<tomorrowDate.getTime())
				{
					durationOfEvent = 2;
					HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent, 2);
					sortedCalendar[this]['includeMe']= false;
					return true;
				}
			}
			else if(!isEmpty(plannedStart) && !isEmpty(plannedEnd) && sortedCalendar[this]['includeMe']==true)
			{
				if(plannedStart.getTime() < tomorrowDate.getTime()) //Planned to start on or before today.
					{
						if(plannedStart.getTime() >= focusDate.getTime() && plannedStart.getTime()<tomorrowDate.getTime()) //If it is starting today.
						{
							if(plannedEnd.getTime() == null || plannedEnd.getTime() < tomorrowDate.getTime()) //started today and ending today.
							{
								durationOfEvent = 2;
								HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent, 0);
								sortedCalendar[this]['includeMe'] = false;
								return true;
							}

							else if(plannedEnd.getTime()>tomorrowDate.getTime()) //started today, and ending past midnight.
							{
								durationOfEvent= 3;
								HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent,0);
								return true;
							}
						}
						else if(plannedStart.getTime()<focusDate.getTime()) //Starting before today.
						{
							if(plannedEnd.getTime()>focusDate.getTime() && plannedEnd.getTime()<tomorrowDate.getTime()) //Started before today, and ending today.
							{
								durationOfEvent = 1;
								HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent,0);
								sortedCalendar[this]['includeMe'] = false;
								return true;
							}
							else if(plannedEnd.getTime()>=tomorrowDate.getTime()) //Started before today and ending past midnight.
							{
								durationOfEvent = 4;
								HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent,0);
								return true;
							}
						}
					}
			}

			else if(!isEmpty(reqStart) && !isEmpty(reqEnd) && sortedCalendar[this]['includeMe'] == true)
			{

				if(reqStart.getTime() < tomorrowDate.getTime()) //Req to start on or before today.
					{

						if(reqStart.getTime() >= focusDate.getTime() && reqStart.getTime() < tomorrowDate.getTime()) //If it is starting today.
						{
							if(reqEnd.getTime() == null || reqEnd.getTime() <= tomorrowDate.getTime()) //started today and ending today.
							{
								durationOfEvent=2;
								HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent,1);
								sortedCalendar[this]['includeMe'] = false;
								return true;
							}

							else if(reqEnd.getTime()>tomorrowDate.getTime()) //started today, and ending past midnight.
							{
								durationOfEvent=3;
								HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent,1);
								return true;
							}
						}
						else if(reqStart.getTime()<focusDate.getTime()) //Starting before today.
						{

							if(reqEnd.getTime()>focusDate.getTime() && reqEnd.getTime()<tomorrowDate.getTime()) //Started before today, and ending today.
							{
								durationOfEvent=1;
								HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent,1);
								sortedCalendar[this]['includeMe'] = false;
								return true;
							}
							else if(reqEnd.getTime()>=tomorrowDate.getTime()) //Started before today and ending past midnight.
							{
								durationOfEvent=4;
								HTMLforThisDay += renderItem(sortedCalendar[this], durationOfEvent,1);
								return true;
							}
						}
					}
			}
		});

		return String(HTMLforThisDay+"</DIV>");

}

function renderItem(sortedCalendar, duration, x)
{
//result, inappropriately named, is an array to store the left and right bookends to note the continuity of an event.
var result = [];
var Dates = "";

//These are for calendar readibility.
		switch(duration)
		{
		case(1):
			result['lb'] = "<="; //1: St<Today, End>Today
			result['rb'] = " | ";
			break;
		case(2):
			result['lb'] = " | "; //2: St=Today, End=Today
			result['rb'] = " | ";
			break;
		case(3):
			result['lb'] = " | "; //3: St=today end>today.
			result['rb'] = " => ";
			break;
		case(4):
			result['lb'] = "<="; //4: St<Today, End>Today;
			result['rb'] = "=>";
			break;
		default:
			result['lb'] = " | ";
			result['rb'] = " | ";
			break;
		}

//Changing the display depending on whether it is planned, or only requested.
		switch(x)
		{
		case(0):
			Dates = "Planned Start: " +sortedCalendar['PLANNED_START_DATE'].toString().substring(4, 21) + "<br> Planned End: " + sortedCalendar['PLANNED_END_DATE'].toString().substring(4, 21);
			tagPorR = "**"; //Not currently used.
			break;
		case(1):
			Dates = "Req. Start: " +sortedCalendar['REQUESTED_START_DATE'].toString().substring(4, 21)+ "<br>Req End: " + sortedCalendar['REQUESTED_END_DATE'].toString().substring(4, 21);
			tagPorR = "";
			break;
		case(2):
			Dates = "Closed Date: " +sortedCalendar['SOLUTION_DATE'].toString().substring(4, 21);
			tagPorR = "";
			break;
		default:
			Dates = "";
			break;
		}

var emailDetailsCheckbox = "<input style='display:inline;' type='checkbox' class='showMoreDetails' reqNum='"+ sortedCalendar['REQUEST_NUMBER'] +"'>";

//A mess of HTML being appended to an ever-growing string...
var cellContents = "<DIV class='ChangeEntry "+ sortedCalendar['TYPE_OF_CHANGE'].replace(/\s/g, '') + " " + sortedCalendar['SERVICE_OWNER'].replace(/\s/g, '') + " "+ sortedCalendar['STATUS'].replace(/\s/g, '') +" "+sortedCalendar['REQUEST_NUMBER'] +"'>";
cellContents += "<p>"+ result['lb'] +emailDetailsCheckbox+" "+ sortedCalendar['TYPE_OF_CHANGE'].charAt(0).toUpperCase() + " | " + sortedCalendar['SERVICE_OWNER'] + " | " + sortedCalendar['REQUEST_NUMBER'] +" |" + result['rb'] + "</p>";
cellContents	+= "<p class='status'>"	+ sortedCalendar['STATUS'] + "</p>"
cellContents 	+= "<p class='seeMoreComments'><details><summary>Details</summary><span class='fullDetailsonCalendar'>"
				+"</p>"
				+"<br>"
				+sortedCalendar['COMMENT']
				+"<br><p>" + sortedCalendar['SHORT_DESCRIPTION']
				+"<p>" + Dates
				+"</p>"
				+ (sortedCalendar['CLOSURE_CODE'].length > 0 ? "<p>Result: " + sortedCalendar['CLOSURE_CODE'] +"</p>":'')
				+"<p>Contact: " + sortedCalendar['REQUESTING_PERSON']
				+ "</p>"
				+ "</span></details></p>";
cellContents += "</DIV>"
return cellContents;
}
