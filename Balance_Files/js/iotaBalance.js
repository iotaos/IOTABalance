/*
=====================================================================================
=                       IOTABalance v1.0.0-beta Release                             =
=                             Local Web Edition                                     =
=                           Date: November 13 2018                                  =
=                          Mockup Designer: Navin.R                                 =
=                             Author: Michael                                       =
=                                  |iotaos|                                         =
=====================================================================================
*/
var iotaBalance = new IotaBalance();
iotaBalance.preInit(true);

function IotaBalance(){
	var my = this;
	var h = {
		inputField:0, dataOut:0, historyOut:0, theBalanceM:0, theBalanceI:0,
		openingMessage:0, sessionMessageNew:0, countResult:0, countResultDiv:0,
		countResultD:0, checkSum:0, charCounting:0, priceMi:0, priceBtc:0, imCap:0, iRank:0, browserNotice:0,
		saveSession:0,saveBar:0, restoreSession:0, restoreBar:0, restorationDone:0, overwriteSession:0, overwriteBar:0,
		overwrittenBar:0, saveSessionDone:0, saveSessionDoneBar:0, nodeSelector:0, nodeSelectForm:0, customNode:0,
		saveNodeSettings:0, deleteSettings:0, exportTextFile:0, qSession:0, directoryLink:0, faqLink:0,overwrittenDone:0,
		themeButton:0,restoredBar:0
	};
	var q = function(key){ return document.querySelector("#"+key); };
	var wasBuilt = false;
	var currentPriceUsd = "";
	var currentRank = "";
	var currentMcap = "";
	var currentSession = [];
	var currentSessionTotals = 0;
	var restoredArray;
	var restoreIsOn = 0;
	var checkRestoreIsOn = false;
	var tempDisableRestore = false;
	var checkRestoreForLightOverwrite = false;
	var currentTheme = "light";
	var restoreCounter=0;
	var querylist = [];
	var currentIRI;
	var sourceUse = ["https://iota.dance/api","node","iota.dance"];
	this.getMyIri = function(){return currentIRI;};
	this.preInit = function(tryAgain){
		if (!tryAgain){ sourceUse = ["https://iotanode.host/apinode_table.json","host", "iotanode.host"]; }
		$.ajax({
			url: sourceUse[0],
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(resDat) {
				console.log("Sources via: " + sourceUse[2]);
				var b="";
				for (var x=0;x<resDat.length;x++){
					querylist.push(resDat[x][sourceUse[1]]);
					b += "<option>"+resDat[x][sourceUse[1]]+"</option>";
				}
				q("browserNotice").innerHTML += '<div class="frontMsg">Current Sources &#x2661; '+sourceUse[2]+'</div><div class="frontMsg">Served via &#x2661; IPFS</div>';
				q("nodeSelectForm").innerHTML = b;
				currentIRI = querylist[Math.floor((Math.random() * querylist.length))];
				sessionMessageNew.innerHTML = '<div class="frontMsg">'+"Setting Randomized:&nbsp;&nbsp;" + currentIRI + '</div>';
				$("#functionbuttons").fadeIn(133);
				my.init();
				watchRandomBtn();
			},
			error: function() {
				my.preInit(false); console.log("Failed getting Nodes Data");
				q("browserNotice").innerHTML += "Source Failure..";
			}
		});
	};
	var watchRandomBtn = function(){
		q("randomSelect").addEventListener('click',function(){
			currentIRI = querylist[Math.floor((Math.random() * querylist.length))];
			$("#sessionMessageNew").fadeOut(333,function(){
				sessionMessageNew.innerHTML = "Setting Randomized: <b>" + currentIRI + '</b>';
				$("#sessionMessageNew").fadeIn(333);
			});
		});
	};
	this.init = function(){
		if (!wasBuilt){
		console.log("Iota Balance");
			for (var key in h ) { h[key] = document.querySelector("#"+key); }
			checkSum.setAttribute('disabled', 'disabled');
			loadDialogs();
			checkLocalStorage();
			initWatch();
			listeningNow();
			wasBuilt=true;
		}
	};
	var initWatch = function(){
		getusd();

		$("#hoverFAQ").on("click", function(){ $('#FAQview').slideToggle(); });

		$("#hoverLinks").on("click", function(){ $('#linksView').slideToggle(); });

		$("#hoverContact").on("click", function(){ $('#contactView').slideToggle(); });
		$("#releasesOpen").on("click", function(){ $('#releasesView').slideToggle(); });
		$('#supportButton').on("click", function(){ $('#supportView').slideToggle(); });
		$(inputField).on('keyup',function(){
			var charCount = $(this).val().replace(/\s/g, '').length;
			if (charCount == 90 || charCount == 81) {  charCounting.textContent="Valid"; console.log("Valid Address");} 
			else if (charCount == 0) { charCounting.textContent = "Validity";}
			else { console.log("yikes"); charCounting.textContent="Invalid"; }
		});

		inputField.addEventListener("change", function(){
			getusd();
			if (theBalanceM.textContent == "") {
				if ($('#inputField').val().length ===90 || $('#inputField').val().length ===81) {getInputAndProcess();}
				else {console.log("invalid address");}
			} else { 
				if ($('#inputField').val().length ===90 || $('#inputField').val().length ===81) {
					if (historyOut.innerHTML == "") {
						historyOut.innerHTML = dataOut.innerHTML;
					} else {
						historyOut.innerHTML = dataOut.innerHTML + historyOut.innerHTML;
					} 		
					getInputAndProcess();
				}
				else {console.log("invalid address");}
			}
		});
	};
	var checkLocalStorage = function(){
		var startupSetNode;
		if (typeof(Storage) !== "undefined") { //check for existing session:
			//h.sessionMessageNew.textContent = ""; 
			
			if (localStorage.getItem("iob_settings") == "" ) {startupSetNode = "Randomized Nodes";}
			else if (localStorage.getItem("iob_settings") == null) {startupSetNode = "Randomized Nodes";}
			else {
				customNode.value = localStorage.getItem("iob_settings");
				startupSetNode = customNode.value;
			}
			if (localStorage.getItem("iob_save") == "") {
				saveSession.style.display = "";
				if (localStorage.getItem("iob_settings") != null) {
					sessionMessageNew.innerHTML = "Setting: " + startupSetNode;
				}
			}
			else if (localStorage.getItem("iob_save") == null) {
				saveSession.style.display = "";
				if (localStorage.getItem("iob_settings") != null) { sessionMessageNew.innerHTML = "Setting: " + startupSetNode; }
			} else {
				var viewing = [qSession,restoreBar,overwriteSession,restoreSession];
				for (var x=0;x<viewing.length;x++){ viewing[x].style.display=""; }
				//saveBar.style.display = "none";
				sessionMessageNew.innerHTML = "";
				sessionMessageNew.style.color="black";
				sessionMessageNew.innerHTML = "Previously Saved Session Detected. (Setting: " + startupSetNode + ")";
				processRestorebutton();
			} 
		} else { sessionMessageNew.textContent = "Your browser does not support LocalStorage of html5. You will need an html5 supported browser for more functionality."; }	
		qSession.style.display ="";
	};
	var processThemeButtons = function() {
		if (currentTheme == "dark") { overwriteSession.style.color = "black"; }
		else { overwriteSession.style.color = "black"; }
	};
	var processRestorebutton = function() {
		if (currentTheme == "dark") { restoreSession.style.color = "white"; }
		if (currentTheme == "light") {}
	};
	var processSaveButton = function() {
		if (currentTheme == "dark") { saveSession.style.color = "white"; }
		else { saveSession.style.color = "purple"; }
	};

	var listeningNow = function() {
		h.themeButton.addEventListener("click", function(){
			if (currentTheme == "dark") {
		   		document.getElementById('css_theme').href = 'css/newlight.css';		
		   		currentTheme = "light";
		   		themeButton.textContent = "Night Mode";
		   		processRestorebutton();
		   		processThemeButtons();
		   		processSaveButton();
			} else {
			  document.getElementById('css_theme').href = 'css/newdark.css';		
			  currentTheme = "dark";
			  themeButton.textContent = "Day Mode";
			  processRestorebutton();
			  processSaveButton();
			}
		});

		$(h.inputField).on('keyup',function(){
			var currentupper = $(this).val().toUpperCase();
			var charCount = currentupper.replace(/\s/g, '').length;
			if (charCount == 81) {
				var strippedChecksum = addChecksum(currentupper, 3, true).substring(-3);
				var strippedcharCount = strippedChecksum.replace(/\s/g, '').length;
				var checkedlastchars = strippedChecksum.substring(strippedcharCount-3, strippedcharCount);
				console.log("Did Checksum Since (81): " + checkedlastchars);	
				checkSum.textContent = checkedlastchars;			
			} else {
				var lastchars = currentupper.substring(charCount-3, charCount);
				if (charCount < 3) {
					checkSum.textContent = "SUM";
				} else {
					checkSum.style.display = "";
					checkSum.textContent = lastchars;	
				}
			}
		});
		h.directoryLink.addEventListener("click", function(){ $("#directoryDialog").dialog("open"); });
		h.faqLink.addEventListener("click", function(){ $("#faqDialog").dialog("open"); });

		h.nodeSelector.addEventListener("click", function(){
	   		generateExport();
			$("#nodeSelectDialog").dialog("open");
		});

		h.saveNodeSettings.addEventListener("click", function(){
			var supersettings = "";
			if (customNode.value != "") {
				supersettings = customNode.value;
				localStorage.setItem("iob_settings", supersettings);
				saveNodeSettings.textContent = "Saved Settings";
			} else {
				supersettings = nodeSelectForm.value; 
				localStorage.setItem("iob_settings", supersettings);
				saveNodeSettings.textContent = "Saved Settings";
			}
		});

		h.deleteSettings.addEventListener("click", function(){
			customNode.value = "";
			localStorage.removeItem("iob_settings");
		});

		h.saveSession.addEventListener("click", function(){
			if (currentSession.length == 0) {
			} else {
				localStorage.setItem("iob_save", currentSession);
				saveSessionDone.style.display = "";
				saveSessionDoneBar.style.display = "";
				saveSession.style.display = "none";
//				saveBar.style.display = "none";
			}
		});

		h.overwriteSession.addEventListener("click", function(){
			if (currentSession.length == 0) {
				$("#overwriteDialog").dialog("open");
			} else if ((restorationDone.style.display == "") && (currentSession.length == restoredArray.length)) {
				console.log('nothing to do');
			} else { 
				localStorage.setItem("iob_save", currentSession);
				h.overwrittenDone.style.display = "";
				//h.overwriteBar.style.display = "none";
				//h.overwrittenBar.style.display = "";
				h.overwriteSession.style.display = "none";			
			}
		});

		restoreSession.addEventListener("click", function(){
			h.restoreBar.style.display = "none";
			//h.overwriteBar.style.display = "none";
			h.restoredBar.style.display = "";
			if (tempDisableRestore == false) {
				restoredArray = localStorage.getItem("iob_save", currentSession).split(',');
				getusd();
				checkRestoreIsOn = true;
				checkRestoreForLightOverwrite =true;
				processRestore();
			}
		});

		h.qSession.addEventListener("click", function(){ $("#helpDialog").dialog("open"); });
	};

	var generateExport = function() {
		if ( (localStorage.getItem("iob_save") == "") || (localStorage.getItem("iob_save") == null) ){
			exportTextFile.href = "#";
			exportTextFile.innerHTML = "Nothing Saved";
		} else {
			var get_export_now = localStorage.getItem("iob_save", currentSession).split(',');
			var export_string = "";
			for (var i=0; i<get_export_now.length; i++){
				export_string = export_string + get_export_now[i] + "\n";
			}
			exportTextFile.href = 'data:text/plain;charset=UTF-8,' + encodeURIComponent(export_string);
			exportTextFile.download = 'My_Addresses_Export.txt';  	
		}
	};

	var processRestore = function() {   
	    tempDisableRestore = true;
	    overwriteSession.style.display = "none";
		var command = {
			'command': 'getBalances',
			'addresses': [restoredArray[restoreCounter]],
			'threshold': 100
		};
		var t0 = performance.now();
		if (customNode.value != "") {
			currentIRI = customNode.value;
		} else {
			//currentIRI = querylist[Math.floor((Math.random() * querylist.length))];
		}
		getITbalance(command, restoreCounter, currentIRI,function(){
			var t1 = performance.now();
			var deltatimes = (t1-t0);
			console.log("Restoration of item " + restoreCounter + " took ~" + deltatimes.toFixed(5) + " ms.");
			 restoreCounter++; 
      		if (restoreCounter < restoredArray.length) { processRestore(); } 
		});
	};
	var getInputAndProcess=function() {
		var uppercaseinput;
		if ($('#inputField').val().length == 90 ) {
			var sendStrippedAddy = $('#inputField').val();
			sendStrippedAddy = sendStrippedAddy.substring(0, 81);
			uppercaseinput = sendStrippedAddy.toUpperCase();
		} else { uppercaseinput = inputField.value.toUpperCase(); }

		if (customNode.value !== "") { currentIRI = customNode.value; }
		else { 
			//	currentIRI = querylist[Math.floor((Math.random() * querylist.length))];
		}

		getITbalance({'command': 'getBalances', 'addresses': [uppercaseinput], 'threshold': 100}, 0, currentIRI);
		restoreCounter++;
	};

	var getITbalance = function(input_command, pass_i, IRItoUse, myCallback) {
		console.log("Query with IRI Instance: " + IRItoUse);
		$.ajax({
			url: IRItoUse,
			type: 'POST',
			dataType: 'json',
			headers: {'X-IOTA-API-Version': '1'},
			contentType: 'application/json',
			data:  JSON.stringify(input_command),
			processData: false,
			success: function(datain) {
				h.countResultDiv.style.display = "";
				
				if (currentTheme == "dark") { h.saveSession.style.color = "white"; }
				else { h.saveSession.style.color = "black"; }

				h.openingMessage.style.fontSize = "11px";
				h.sessionMessageNew.textContent = "";
				h.browserNotice.style.display = "none";
				currentSession.push(input_command.addresses[0]);
				h.overwrittenDone.style.display = "none"; 
				if ( (h.overwrittenDone.style.display == "none") && (h.restorationDone.style.display == "") ) {
				  	 h.overwriteSession.style.display = "";
				  	 //h.overwriteBar.style.display = "";
				  	 //h.overwrittenBar.style.display = "none";
				}
				if (saveSessionDone.style.display == "") {
					h.saveSession.style.display = ""; 
					//h.saveBar.style.display = "";
					h.saveSessionDone.style.display = "none"; h.saveSessionDoneBar.style.display = "none";
				}
				if (checkRestoreForLightOverwrite == true) {
					if (currentSession.length == restoredArray.length) { h.overwriteSession.style.color = "black"; }
					else { processThemeButtons(); }				
				}
				var currentmi = datain.balances[0]/1000000;
				currentSessionTotals = currentSessionTotals + currentmi;
				h.countResult.textContent = currentSessionTotals;
				var quicktotalcount = parseFloat(Math.round(currentPriceUsd * currentSessionTotals * 100) / 100).toFixed(2);
				h.countResultD.textContent = quicktotalcount;
				h.openingMessage.style.color = "black";
				h.openingMessage.textContent = " " + input_command.addresses[0];
				var quickcalc = parseFloat(Math.round(currentPriceUsd * currentmi * 100) / 100).toFixed(2);
				h.theBalanceM.textContent = " " + datain.balances[0]/1000000 + " Mi" + " ~ " + quickcalc + " $" ;

				h.theBalanceI.innerHTML = datain.balances[0] + " i" + " @ Index: " + datain.milestoneIndex + " | IRI : " + IRItoUse ;

				h.inputField.value = "";
				if (checkRestoreIsOn === true) {console.log("Generating Restoration Display"); restore_appending(pass_i);}
				if (restoredArray == undefined) {}
					else {
				  	  if (restoreCounter == restoredArray.length+1) {
				  	  	h.overwriteSession.style.display = "";
				  	  	//h.overwriteBar.style.display = "";
				  		}
					}
				if (restoredArray == undefined) {
					console.log("Not a Restored Session"); h.restoreSession.style.display = "none"; h.restoreBar.style.display = "none";
				}
				if (localStorage.getItem("iob_save") !== ""){
						h.overwriteSession.style.display = ""; 
						//h.overwriteBar.style.display = ""; 
						//h.overwrittenBar.style.display = "none";					
				}
				if (typeof myCallback !== 'undefined' && typeof myCallback === 'function'){
					myCallback();
				}
			},
			error: function(){
				inputField.value = "";
				charCounting.textContent = "Query Error";
			}
		});
	};

	var restore_appending = function(pass_i) {
		if (restoredArray.length == 1) {} else {
			if (historyOut.innerHTML == "") {
				historyOut.innerHTML = dataOut.innerHTML;
			} else {
				if (pass_i != restoredArray.length-1 ) {
					historyOut.innerHTML = dataOut.innerHTML + historyOut.innerHTML ; 		
				} else {
					checkRestoreIsOn = false; 
					restoreSession.style.display = "none";
					restorationDone.style.display = "";
				}
			}		
		}
	};

	var getusd = function() {
		$.ajax({
			url: "https://api.coinmarketcap.com/v1/ticker/iota/",
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			success: function(datain) { 
				currentPriceUsd = datain[0].price_usd; currentpricebtc = datain[0].price_btc; 
				currentRank = datain[0].rank; 
				currentMcap = datain[0].market_cap_usd;
				console.log("Updated Market Data");
				settopprices();
			},
			error: function() { console.log("Failed getting CMC Data"); }
		});
	};

	var settopprices = function() {
		var fixdecimalprice = parseFloat(Math.round(currentPriceUsd* 100) / 100).toFixed(3);
		var fixmcap = parseFloat((currentMcap/1000000000)).toFixed(3);
		priceMi.textContent = fixdecimalprice;
		priceBtc.textContent = currentpricebtc;
		iRank.textContent = currentRank;
		imCap.textContent = fixmcap;
	};


	var loadDialogs = function() {
		$("#overwriteDialog").dialog({
			autoOpen: false,
			width:250,
			height:120,
			buttons: {
			    "Clear All": function() {
				    localStorage.setItem("iob_save", currentSession);
					overwriteSession.textContent = "Cleared.";
					restoreSession.style.display = "none";
					window.location.reload(false); 
					$(this).dialog("close");
				}
			}
		});

		$("#helpDialog").dialog({
			autoOpen: false,
			width:250,
			height:315,
			buttons: {}
		});

		$("#faqDialog").dialog({
			autoOpen: false,
			width:250,
			height:115,
			buttons: {}
		});

		$("#nodeSelectDialog").dialog({
			autoOpen: false,
			width:250,
			height:55,
			buttons: {}
		});
		
		$("#directoryDialog").dialog({
			autoOpen: false,
			width:330,
			buttons: {}
		});
	};


	//Stripped out from iota.lib.js (with other required components, with removed "requires" & "modules")
	var addChecksum = function(inputValue, checkSumLengthIn, isAddressIn) {

	    // checkSum length is either user defined, or 9 trytes
	    var checkSumLength = checkSumLengthIn || 9;
	    var isAddress = (isAddressIn !== false);

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
	        var checkSumTrits = [];

	        // Absorb address trits
	        kerl.absorb(addressTrits, 0, addressTrits.length);

	        // Squeeze checkSum trits
	        kerl.squeeze(checkSumTrits, 0, kerl.HASH_LENGTH);

	        // First 9 trytes as checkSum
	        var checkSum = trytes( checkSumTrits ).substring( 81 - checkSumLength, 81 );
	        inputsWithChecksum.push( thisValue + checkSum );
	    });

	    if (isSingleInput) {

	        return inputsWithChecksum[ 0 ];

	    } else {

	        return inputsWithChecksum;

	    }
	};

}