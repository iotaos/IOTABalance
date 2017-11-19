/*
=====================================================================================
=                       IOTABalance v1.0.0-beta Release                             =
=                             Local Web Edition                                     =
=                           Date: August 20th 2017                                  =
=                          Mockup Designer: Navin.R                                 =
=                             Author: Michael.S                                     =
=                                  |iotaos|                                         =
=====================================================================================
*/
var input_balances = document.getElementById("input_field");
var data_out = document.getElementById("data_out");
var history_out = document.querySelector("#history_out");
var lookup_button = document.querySelector("#lookup_button");
var the_balanceM = document.querySelector("#the_balanceM");
var the_balanceI = document.querySelector("#the_balanceI");
var the_details_link = document.querySelector("#the_details_link");
var at_milestone = document.querySelector("#at_milestone");
var opening_message = document.querySelector("#opening_message");
var session_message_new = document.querySelector("#session_message_new");
var count_result = document.querySelector("#count_result");
var count_result_div = document.querySelector("#count_result_div");
var count_result_d = document.querySelector("#count_result_d");
var checksum = document.querySelector("#checksum");
var charcounting = document.querySelector("#charcounting");
var goodcheckimg = document.querySelector("#goodcheck");
var priceMi = document.querySelector("#priceMi");
var priceBtc = document.querySelector("#priceBtc");
var imcap = document.querySelector("#imcap");
var irank = document.querySelector("#irank");
var browser_notice = document.querySelector("#browser_notice");
var currentpriceusd = "";
var currentrank = "";
var currentmcap = "";
var current_session = [];
var current_session_totals = 0;
var restored_array;
var restoreON = 0;
var checkrestoreON = false;
var tempdisablerestore = false;
var checkrestorewhighlightoverwrite = false;
var saveSession = document.querySelector("#saveSession");
var savebar = document.querySelector("#savebar");
var restoreSession = document.querySelector("#restoreSession");
var restorebar = document.querySelector("#restorebar");
var restoredbar = document.querySelector("#restoredbar");
var restoration_done = document.querySelector("#restoration_done");
var overwriteSession = document.querySelector("#overwriteSession");
var overwritebar = document.querySelector("#overwritebar");
var overwrittenbar = document.querySelector("#overwrittenbar");
var saveSession_done = document.querySelector("#saveSession_done");
var saveSession_donebar = document.querySelector("#saveSession_donebar");
var nodeSelector = document.querySelector("#nodeSelector");
var nodeSelectForm = document.querySelector("#NodeSelectForm");
var custom_node = document.querySelector("#custom_node");
var save_node_settings = document.querySelector("#save_node_settings");
var delete_settings = document.querySelector("#delete_settings");
var export_text_file = document.querySelector("#export_text_file");
var qSession = document.querySelector("#qSession");
var directorylink = document.querySelector("#directorylink");
var getvideodialog = document.querySelector("#getvideodialog");
var faqlink = document.querySelector("#faqlink");
var theme_button = document.querySelector("#theme_button");
var current_theme = "light";
var restorecounter=0;
checksum.setAttribute('disabled', 'disabled');
checklocalstorage();
load_dialogs();
listeningnow();

var querylist = ["https://n1.iota.nu:443",
"https://node.tangle.works:443",
"http://service.iotasupport.com:14265",
"http://eugene.iota.community:14265",
"http://eugene.iotasupport.com:14999",
"http://eugeneoldisoft.iotasupport.com:14265",
"http://node01.iotatoken.nl:14265",
"http://node02.iotatoken.nl:14265",
"http://node03.iotatoken.nl:14265",
"http://mainnet.necropaz.com:14500",
"http://5.9.149.169:14265",
"http://iota.digits.blue:14265",
"http://wallets.iotamexico.com:80",
"http://5.9.137.199:14265",
"http://5.9.118.112:14265",
"http://5.9.149.169:14265",
"http://88.198.230.98:14265",
"http://176.9.3.149:14265",
"http://node.lukaseder.de:14265"];
var currentIRI;

function checklocalstorage () {
	var startup_set_node;
	if (typeof(Storage) !== "undefined") {
		session_message_new.textContent = "";
		//check for existing session:
		if (localStorage.getItem("iob_settings") == "" ) {startup_set_node = "Randomized Nodes";}
			else if (localStorage.getItem("iob_settings") == null) {startup_set_node = "Randomized Nodes";}
				else {
					custom_node.value = localStorage.getItem("iob_settings");
					startup_set_node = custom_node.value;
				}
		if (localStorage.getItem("iob_save") == "") {
			saveSession.style.display = ""; qSession.style.display ="inline-block";
			if (localStorage.getItem("iob_settings") != null) {
				session_message_new.innerHTML = "Setting: " + startup_set_node;
			} else {}
		}
		else if (localStorage.getItem("iob_save") == null) {
			saveSession.style.display = ""; qSession.style.display ="inline-block";
			if (localStorage.getItem("iob_settings") != null) {
				session_message_new.innerHTML = "Setting: " + startup_set_node;
			}
		}
		else { 	
			savebar.style.display = "none";
			restorebar.style.display = "";
		 	qSession.style.display ="inline-block";
			overwriteSession.style.display = "";
			overwritebar.style.display = "";
			session_message_new.innerHTML = "";
			restoreSession.style.display = "";
			processRestorebutton();
			session_message_new.style.color="black";
			session_message_new.innerHTML = "Previously Saved Session Detected. (Setting: " + startup_set_node + ")";
			alignfooter();
		} 
	} else {
		session_message_new.textContent = "Your browser does not support LocalStorage of html5...You will need a modern browser for furthur functionality.";
	}	
}
//Old
function processThemeButtons() {
	if (current_theme == "dark") {
		overwriteSession.style.color = "black";
	} else {
		overwriteSession.style.color = "black";
	}
}
//Old
function processRestorebutton() {
	if (current_theme == "dark") {
		restoreSession.style.color = "white";
	}
	if (current_theme == "light") {
	//	restoreSession.style.color = "blue";
	}
}
//Old
function processSaveButton() {
	if (current_theme == "dark") {
		saveSession.style.color = "white";
	} else {
		saveSession.style.color = "purple";
	}
}

function listeningnow() {
	theme_button.addEventListener("click", function(){
		if (current_theme == "dark") {
	   		document.getElementById('css_theme').href = 'css/newlight.css';		
	   		current_theme = "light";
	   		theme_button.textContent = "Night Mode";
	   		processRestorebutton();
	   		processThemeButtons();
	   		processSaveButton();
		} else {
		  document.getElementById('css_theme').href = 'css/newdark.css';		
		  current_theme = "dark";
		  theme_button.textContent = "Day Mode";
		  processRestorebutton();
		  processSaveButton();
		}
	});

	$(input_balances).on('keyup',function(){
		var currentupper = $(this).val().toUpperCase();
		var charCount = currentupper.replace(/\s/g, '').length;
		//var currenttrytes = toTrytes(currentupper);
		if (charCount == 81) {
			var strippedChecksum = addChecksum(currentupper, 3, true).substring(-3);
			var strippedcharCount = strippedChecksum.replace(/\s/g, '').length;
			var checkedlastchars = strippedChecksum.substring(strippedcharCount-3, strippedcharCount);
			console.log("Did Checksum Since (81): " + checkedlastchars);	
			checksum.textContent = checkedlastchars;			
		} else {
			var lastchars = currentupper.substring(charCount-3, charCount);
			//console.log(lastchars);
			if (charCount < 3) {
				checksum.textContent = "SUM";
			} else {
				checksum.style.display = "";
				checksum.textContent = lastchars;	
			}
		}
	});

	directorylink.addEventListener("click", function(){
		$("#directory_dialog").dialog("open");
	});
	
	faqlink.addEventListener("click", function(){
		$("#faq_dialog").dialog("open");
	});

	nodeSelector.addEventListener("click", function(){
   		generateExport();
		$("#nodeselectDialog").dialog("open");
	});

	save_node_settings.addEventListener("click", function(){
		var supersettings = "";
		if (custom_node.value != "") {
			supersettings = custom_node.value;
			localStorage.setItem("iob_settings", supersettings);
			save_node_settings.textContent = "Saved Settings";
		} else {
			supersettings = nodeSelectForm.value; 
			localStorage.setItem("iob_settings", supersettings);
			save_node_settings.textContent = "Saved Settings";
		}
	});

	delete_settings.addEventListener("click", function(){
		custom_node.value = "";
		localStorage.removeItem("iob_settings");
	});

	if (getvideodialog == null) {}
	else {
		getvideodialog.addEventListener("click", function(){
			$("#video_dialog").dialog("open");
		});
	}

	saveSession.addEventListener("click", function(){
		if (current_session.length == 0) {
		} else {
			localStorage.setItem("iob_save", current_session);
			saveSession_done.style.display = "";
			saveSession_donebar.style.display = "";
			saveSession.style.display = "none";
			savebar.style.display = "none";
		}
	});

	overwriteSession.addEventListener("click", function(){
		if (current_session.length == 0) {
			$("#overwrite_dialog").dialog("open");
		} else if ((restoration_done.style.display == "") && (current_session.length == restored_array.length)) {
			console.log('nothing to do');
		} else { 
			localStorage.setItem("iob_save", current_session);
			overwritten_done.style.display = "";
			overwritebar.style.display = "none";
			overwrittenbar.style.display = "";
			overwriteSession.style.display = "none";			
		}
	});

	restoreSession.addEventListener("click", function(){
		restorebar.style.display = "none";
		overwritebar.style.display = "none";
		restoredbar.style.display = "";
		if (tempdisablerestore == false) {
			restored_array = localStorage.getItem("iob_save", current_session).split(',');
			console.log(restored_array);
			getusd();
			checkrestoreON = true;
			checkrestorewhighlightoverwrite =true;
			processRestore();
		}
	});

	qSession.addEventListener("click", function(){
		$("#help_dialog").dialog("open");
	});
}

function generateExport () {
	if ( (localStorage.getItem("iob_save") == "") || (localStorage.getItem("iob_save") == null) ){
		export_text_file.href = "#";
		export_text_file.innerHTML = "Nothing Saved";
	} else {
		var get_export_now = localStorage.getItem("iob_save", current_session).split(',');
		var export_string = "";
		for (var i=0; i<get_export_now.length; i++){
			export_string = export_string + get_export_now[i] + "\n";
		}
		export_text_file.href = 'data:text/plain;charset=UTF-8,' + encodeURIComponent(export_string);
		export_text_file.download = 'My_Addresses_Export.txt';  	
	}
}

function processRestore () {   
    tempdisablerestore = true;
    overwriteSession.style.display = "none";
    setTimeout(function () {    
		var command = {
			'command': 'getBalances',
			'addresses': [restored_array[restorecounter]],
			'threshold': 100
		}
		var t0 = performance.now();
		if (custom_node.value != "") {
			currentIRI = custom_node.value;
		} else {
			currentIRI = querylist[Math.floor((Math.random() * 19))];
		}
		getITbalance(command, restorecounter, currentIRI);
		var t1 = performance.now();
		var deltatimes = (t1-t0);
		console.log("Restoration of item " + restorecounter + " took ~" + deltatimes.toFixed(5) + " ms.");

      restorecounter++; 
      if (restorecounter < restored_array.length) { 
         processRestore(); 
      } 
   }, 400); 
}


/* //Old
function processRestore() {
	setTimeout(myFunction, 3000)
	checkrestoreON = true;
	checkrestorewhighlightoverwrite =true;
	for (var i = 0 ; i < restored_array.length ; i++ ) {
		var command = {
			'command': 'getBalances',
			'addresses': [restored_array[i]],
			'threshold': 100
		}
		var t0 = performance.now();
		getITbalance(command, i);
		var t1 = performance.now();
		console.log("restoring item " + i + "took" + (t1 - t0) + " milliseconds.");
	}
}
*/
//character count
$(input_balances).on('keyup',function(){
	var charCount = $(this).val().replace(/\s/g, '').length;
	//display counter $(charcounting).text(charCount);
	//console.log(charCount); // removed    
	if (charCount == 90 || charCount == 81) {  charcounting.textContent="Valid"; console.log("Valid Address");} 
	else if (charCount == 0) { charcounting.textContent = "Validity";}
	else { console.log("yikes"); charcounting.textContent="Invalid"; }
});

input_field.addEventListener("change", function(){
	getusd();
	if (the_balanceM.textContent == "") {
		if ($('#input_field').val().length ===90 || $('#input_field').val().length ===81) {getInputAndProcess();}
		else {console.log("invalid address");}
	} else { 
		if ($('#input_field').val().length ===90 || $('#input_field').val().length ===81) {
			if (history_out.innerHTML == "") {
				history_out.innerHTML = data_out.innerHTML;
			} else {
				history_out.innerHTML = data_out.innerHTML + history_out.innerHTML ; alignfooter();
			} 		
			getInputAndProcess();;
		}
		else {console.log("invalid address");}
	}
});

function getInputAndProcess () {
	var uppercaseinput;
	if ($('#input_field').val().length == 90 ) {
		var sendStrippedAddy = $('#input_field').val();
		sendStrippedAddy = sendStrippedAddy.substring(0, 81);
		uppercaseinput = sendStrippedAddy.toUpperCase();
	} else {
		uppercaseinput = input_field.value.toUpperCase();
	}
	var command = {
		'command': 'getBalances',
		'addresses': [uppercaseinput],
		'threshold': 100
	}
	if (custom_node.value != "") {
		currentIRI = custom_node.value;
	} else {
		var getrandomselection = Math.floor((Math.random() * 19));
		currentIRI = querylist[getrandomselection];
	}
	//console.log(command)
	getITbalance(command, 0, currentIRI);
	restorecounter++;
}

function getITbalance (input_command, pass_i, IRItoUse) {
	console.log("Query with IRI Instance: " + IRItoUse);
	$.ajax({
		url: IRItoUse,
		type: 'POST',
		dataType: 'json',
		headers: {'X-IOTA-API-Version': '1'},
		contentType: 'application/json',
		data:  JSON.stringify(input_command),
		processData: false,
		success: function (datain) {
			count_result_div.style.display = "";
			if (current_theme == "dark") {
				saveSession.style.color = "white";
			} else {
				saveSession.style.color = "black";
			}
			opening_message.style.fontSize = "11px";
			session_message_new.textContent = "";
			browser_notice.style.display = "none";
			current_session.push(input_command.addresses[0]);
			overwritten_done.style.display = "none"; 
			if ( (overwritten_done.style.display == "none") && (restoration_done.style.display == "") ) {
			  	 overwriteSession.style.display = ""; overwritebar.style.display = ""; overwrittenbar.style.display = "none";
			}
			if (saveSession_done.style.display == "") {
				saveSession.style.display = ""; savebar.style.display = ""; saveSession_done.style.display = "none"; saveSession_donebar.style.display = "none";
			}
			if (checkrestorewhighlightoverwrite == true) {
				if (current_session.length == restored_array.length) {
					overwriteSession.style.color = "black";
				} else { 
					processThemeButtons();
				}				
			}
			var currentmi = datain.balances[0]/1000000;
			current_session_totals = current_session_totals + currentmi;
			count_result.textContent = current_session_totals;
			var quicktotalcount = parseFloat(Math.round(currentpriceusd * current_session_totals * 100) / 100).toFixed(2);
			count_result_d.textContent = quicktotalcount;
			opening_message.style.color = "black";
			//console.log(datain);
			opening_message.textContent = " " + input_command.addresses[0];
			var quickcalc = parseFloat(Math.round(currentpriceusd * currentmi * 100) / 100).toFixed(2);
			the_balanceM.textContent = " " + datain.balances[0]/1000000 + " Mi" + " ~ " + quickcalc + " $" ;
			var this_detail_link = "https://iota.codebuffet.co/#/addr/" + input_command.addresses[0];
			the_balanceI.innerHTML = datain.balances[0] + " i" + " @ Index: " + datain.milestoneIndex + " | IRI : " + IRItoUse + " | " + '<a target="_blank" href="'+this_detail_link+'">'+"Details"+'</a>';
			input_field.value = "";
			if (checkrestoreON === true) {console.log("Generating Restoration Display"); restore_appending(pass_i);}
			if (restored_array == undefined) {}
				else {
			  	  if (restorecounter == restored_array.length+1) {overwriteSession.style.display = ""; overwritebar.style.display = "";}
				}
			if (restored_array == undefined) {
				console.log("Not a Restored Session"); restoreSession.style.display = "none"; restorebar.style.display = "none";
				//overwriteSession.style.display = ""; overwritebar.style.display = ""; overwrittenbar.style.display = "none";
			}
			if (localStorage.getItem("iob_save") == "") { }
				else {
					overwriteSession.style.display = ""; overwritebar.style.display = ""; overwrittenbar.style.display = "none";					
			}
			alignfooter();
		},
		error: function(){
			input_field.value = "";
			charcounting.textContent = "Query Error";
		}
	});
}

function restore_appending (pass_i) {
	if (restored_array.length == 1) {} else {
		if (history_out.innerHTML == "") {
			history_out.innerHTML = data_out.innerHTML;
		} else {
			if (pass_i != restored_array.length-1 ) {
				history_out.innerHTML = data_out.innerHTML + history_out.innerHTML ; 		
			} else {
				checkrestoreON = false; 
				restoreSession.style.display = "none";
				restoration_done.style.display = "";
			}
		}		
	}
	alignfooter();	
}

function getusd() {
	$.ajax({
		url: "https://api.coinmarketcap.com/v1/ticker/iota/",
		type: 'GET',
		crossDomain: true,
		dataType: 'json',
		success: function(datain) { 
			currentpriceusd = datain[0].price_usd; currentpricebtc = datain[0].price_btc; 
			currentrank = datain[0].rank; 
			currentmcap = datain[0].market_cap_usd;
			console.log("Updated Market Data")
			settopprices();
		},
		error: function() { console.log("Failed getting CMC Data"); }
	});
}

function alignfooter() {
	var docHeight = $(window).height();
	var footerHeight = $('#footer').height() ;
	var footerTop = $('#footer').position().top + footerHeight;
	if (footerTop < docHeight) {
		$('#footer').css('margin-top', -160 + (docHeight - footerTop) + 'px');
	}
};

function settopprices() {
	var fixdecimalprice = parseFloat(Math.round(currentpriceusd* 100) / 100).toFixed(3);
	var fixmcap = parseFloat((currentmcap/1000000000)).toFixed(3);
	priceMi.textContent = fixdecimalprice;
	priceBtc.textContent = currentpricebtc;
	irank.textContent = currentrank;
	imcap.textContent = fixmcap;
}

$( document ).ready(function() {
	alignfooter();
	getusd();
});

$("#hoverchart").on("click", function(){
	$('#chart_view').slideToggle();
});

$("#hoverFAQ").on("click", function(){
	$('#FAQview').slideToggle();
});

$("#hoverLinks").on("click", function(){
	$('#Links_view').slideToggle();
});

$("#hoverContact").on("click", function(){
	$('#contactView').slideToggle();
});
$("#releasesOpen").on("click", function(){
	$('#releasesView').slideToggle();
});
$('#supportButton').on("click", function(){
	$('#support_View').slideToggle();
});

function load_dialogs() {
	$("#overwrite_dialog").dialog({
		autoOpen: false,
		width:250,
		height:120,
		buttons: {
		    "Clear All": function() {
			    localStorage.setItem("iob_save", current_session);
				overwriteSession.textContent = "Cleared."
				restoreSession.style.display = "none";
				window.location.reload(false); 
				$(this).dialog("close");
			}
		}
	});

	$("#help_dialog").dialog({
		autoOpen: false,
		width:250,
		height:315,
		buttons: {}
	});

	$("#faq_dialog").dialog({
		autoOpen: false,
		width:250,
		height:115,
		buttons: {}
	});

	$("#nodeselectDialog").dialog({
		autoOpen: false,
		width:250,
		height:55,
		buttons: {}
	});
	
	$("#directory_dialog").dialog({
		autoOpen: false,
		width:330,
		buttons: {}
	});
	/*//Old
	$("#video_dialog").dialog({
		autoOpen: false,
		width:800,
		buttons: {}
	});*/
}

//Stripped out from iota.lib.js (with other required components, with removed "requires" & "modules")
/*var testchecksum = addChecksum("addresscheck", 3, true).substring(-3);
console.log("Checking Stripped Version");*/
function addChecksum (inputValue, checksumLength, isAddress) {

    // checksum length is either user defined, or 9 trytes
    var checksumLength = checksumLength || 9;
    var isAddress = (isAddress !== false);

    // the length of the trytes to be validated
    var validationLength = isAddress ? 81 : null;

    var isSingleInput = isString( inputValue );

    // If only single address, turn it into an array
    if ( isSingleInput ) inputValue = new Array( inputValue );

    var inputsWithChecksum = [];

    inputValue.forEach(function(thisValue) {

        // check if correct trytes
        if (!isTrytes(thisValue, validationLength)) {
            throw new Error("Invalid input");
        }

        var kerl = new Kerl();
        kerl.initialize();

        // Address trits
        var addressTrits = trits(thisValue);

        // Checksum trits
        var checksumTrits = [];

        // Absorb address trits
        kerl.absorb(addressTrits, 0, addressTrits.length);

        // Squeeze checksum trits
        kerl.squeeze(checksumTrits, 0, kerl.HASH_LENGTH);

        // First 9 trytes as checksum
        var checksum = trytes( checksumTrits ).substring( 81 - checksumLength, 81 );
        inputsWithChecksum.push( thisValue + checksum );
    });

    if (isSingleInput) {

        return inputsWithChecksum[ 0 ];

    } else {

        return inputsWithChecksum;

    }
}

