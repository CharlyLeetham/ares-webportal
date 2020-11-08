import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
	tagName: '',
  
	swiconicfsel: computed(function() {
		var swiconicf;
		swiconicf = this.get('char.custom.iconicf');	
		return swiconicf;
	}), 
	
	swracesel: computed(function() {
		var swiconicf;
		swiconicf = this.get('char.custom.cgrace');
		return swiconicf;
	}),
	
	
	swsysedges: computed(function() {
		var swiconicf;
		swiconicf = this.get('char.custom.sysedges');
		return swiconicf;
	}),	
	
	swsyshind: computed(function() {
		var swiconicf;
		swiconicf = this.get('char.custom.swsyshind');
		// console.log (swiconicf);
		return swiconicf;
	}),
	
	hjtables: computed (function() {
		var swrifts_hjslots;
		swrifts_hjslots = this.get('char.custom.hjslots');
		return swrifts_hjslots;
	}),
	

	didInsertElement: function() {
	let self = this;
	this.set('updateCallback', function() { return self.onUpdate(); } );
	},

	onUpdate: function() {
	// Return a hash containing your data.  Character data will be in 'char'.  For example:
	// 
	// return { goals: this.get('char.custom.goals') };
	return { iconicf: this.get('char.custom.charicf'), race: this.get('char.custom.charrace'), cgedges: this.get('char.custom.cgedges'), cgedgesnofw: this.get('char.custom.cgedgesnofw'), cghind: this.get('char.custom.cghind'), cghindnofw: this.get('char.custom.cghindnofw') };
	},
  
	ck_excludes: function(dislist, sysedg, traittype) {
		var trexcludes;
		// Check to see the Hinderance excludes others and mark them as disabled.
		if (dislist[0]['trexcludes'].length > 0) {
			for (const [k1, v1] of Object.entries(dislist[0]['trexcludes'])) {
				trexcludes = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == v1.toLowerCase());
				trexcludes[0]['disabled']= true;
			}
		}	
	},

	ck_includes: function(dislist, sysedg, traittype) {
		var trexcludes;
		// Check to see the Hinderance excludes others and mark them as disabled.
		if (dislist[0]['trexcludes'].length > 0) {
			for (const [k1, v1] of Object.entries(dislist[0]['trexcludes'])) {
				trexcludes = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == v1.toLowerCase());
				trexcludes[0]['disabled']= false;
			}
		}	
	},
  
  	find_duplicate_in_array: function(arra1) {
		var object = {};
		var result = [];

		arra1.forEach(function (item) {
		  if(!object[item])
			  object[item] = 0;
			object[item] += 1;
		})

		for (var prop in object) {
		   if(object[prop] >= 2) {
			   result.push(prop);
		   }
		}

		return result;
	},
 
	changedges: function(sysedg, newedgarray, traittype, fw) {
		var cgtr1=[], i, en, specchar, dislist, exedg, traitclass;

		if (traittype=='edge') {
			exedg = this.get('char.custom.cgedges');
		} else {
			exedg = this.get('char.custom.cghind');		
		}

		if (fw == 'icf') {
			specchar = '*';
		} else if (fw == 'race') {
			specchar ='^';
		}

		i = 0;		
		if ( fw=='icf' ) {
			for (const[ed, desc] of Object.entries(exedg)) {
				if (desc['class'].includes('^')) {
					cgtr1[i] = [];
					cgtr1[i]['class']=desc['class'];
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				}
			}
		} else if ( fw=='race') {
			for (const[ed, desc] of Object.entries(exedg)) {
				if (desc['class'].includes('*')) {
					cgtr1[i]=[];
					cgtr1[i]['class']=desc['class'];
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				}
			}
		}

		// Clear the edges list for the framework

		//If there are new edges or hinderances, go through and set these to disabled in the edge drop down.
		
		var loc1, loc2, newclass, index, trexcludes;
		
		if (newedgarray) {

			for (const [key, value] of Object.entries(newedgarray)) {
				en = value.split(specchar)[0].toLowerCase().trim(); // Take the trailing * from the edge for I/F's
				loc1=value;

				dislist = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
				for (const [key1, value1] of Object.entries(dislist)) {
					value1['disabled'] = true; //Set disabled for this element to true
					// Write the new CG Edges array for a nice display
					// Does this already exist as an edge?

					if (traittype == 'hind') {
						trexcludes = this.ck_excludes(dislist, sysedg, traittype);
					}
					
					if (cgtr1.length > 0) {
						for (const [key2, value2] of Object.entries(cgtr1)) {
							if (value2['name'].toLowerCase().startsWith(en)) {
								if (fw=='edge') {
									loc2 = value2['class'].split('^')[0].trim(); // Take the trailing * from the edge for I/F's
									loc2 = loc2+'*^';
									cgtr1[key2]['class'] = loc2;
									loc1 = '';
								} else {
									loc2 = value2['class'].split('*')[0].trim(); // Take the trailing * from the edge for I/F's
									loc2 = loc2+'*^';
									cgtr1[key2]['class'] = loc2;
									loc1 = '';
								}
							}
						}
					} 
					
					if (loc1.length > 0) {					
						cgtr1[i]=[]
						cgtr1[i]['class'] = loc1;
						cgtr1[i]['name'] = en;
						cgtr1[i]['rating'] = value1['desc'];
						i=i+1;
					}
				}
			}
		}
		
		// sort the data
		cgtr1.sort(function (x, y) {
			let a = x.name.toLowerCase(),
				b = y.name.toLowerCase();
			return a == b ? 0 : a > b ? 1 : -1;
		});
		
		if (traittype == 'edge') {
			this.set('char.custom.sysedges', sysedg); //Send the new dropdown back to the page. 
			this.set('char.custom.cgedges', cgtr1); //Send the new array back to the page for nice display. 	
			this.set('char.custom.cgedgesfw', cgtr1); //Send the new array back to the page for nice display. 	
		} else {
			this.set('char.custom.swsyshind', sysedg); //Send the new dropdown back to the page. 
			this.set('char.custom.cghind', cgtr1); //Send the new array back to the page for nice display.			
			this.set('char.custom.cghindfw', cgtr1); //Send the new array back to the page for nice display.			
		}
		return;
	},

	checktrait: function(swraceall, swiconicfall, swrace, swiconicf, chosenifarray, newval, traittype) {
		
		// Check the Race and make sure it can be used. If it can't, grey it out from the list. Allow them to select None, to reset the list.
		var i = 0, dislist44, evalrace=[], en1, complrace, newedgarray, newhindarray, newcyberarray, comptypearray=[], comptypearray2=[], comptypearray3=[], comptypearray4=[], lowedgarray, racecompl, fullsys, listsys, rppe, risp, rnsb, rcyber, rbp;
		
		if (traittype == 'icf') {
			fullsys = swraceall;
			listsys = swrace;
		} else {
			fullsys = swiconicfall;
			listsys = swiconicf;					
		}		
		
		newedgarray = chosenifarray[0].edges; // Select the edges for the new if
		if (newedgarray) {
			lowedgarray = newedgarray.map(newedgarray => newedgarray.toLowerCase());	
		}
		newhindarray = chosenifarray[0].hinderances; // Select the hinderances for the new if
		newcyberarray = chosenifarray[0].cybernetics; // Select the cybernetics for the new if
		racecompl = chosenifarray[0].complications;		
		
		comptypearray = ['ab miracles*', 'ab magic*']; // Used for PPE check
		comptypearray2 = ['ab psionics*']; // Used for psionics check
		comptypearray3 = ['power armor jock*']; // Used for cyber check
		comptypearray4 = ['juicer', 'crazy']; // Used for Bizarre Physiology
		rppe = "Restricted Path PPE^";
		risp = "Restricted Path ISP^";
		rcyber = "Cyber Resistant^";
		rnsb = "Non-Standard Build^";
		rbp = "Bizarre Physiology^";
			
		if (traittype == 'icf') {
			for (const [key, value] of Object.entries(swraceall)) { //Loop through the race values. We want to know which races an Iconic Framework can't have.		
				
				complrace = value.hasOwnProperty('complications');

				if (complrace && newedgarray) { //Complications exist on the character
					for (const [k, v] of Object.entries(value.complications)) {
						var ppe_check = v.includes(rppe) // see if the race has the value
						var isp_check = v.includes(risp) //see if the race has the value
						var cyber_check = v.includes(rcyber) //see if the race has the value
						var nsb_check = v.includes(rnsb) //see if the race has the value
						var bp_check = v.includes(rbp) //see if the race has the value	
						if (ppe_check == true) {
							var ppetest = lowedgarray.some(v => comptypearray.includes(v));
						}

						if (ppe_check == true) {
							var ppetest = lowedgarray.some(v => comptypearray.includes(v));
							// Check if the race can use this 
						}	

						if (isp_check == true) {
							var isptest = lowedgarray.some(v => comptypearray2.includes(v));		
						}											
						
						if (nsb_check == true) {
							var nsbtest = lowedgarray.some(v => comptypearray3.includes(v));		
						}						
						
						if (bp_check == true) {
							var bptest = lowedgarray.some(v => comptypearray4.includes(v));
						}

						if (newcyberarray) {
						}

						if (ppe_check==true || isp_check==true || nsb_check == true || bp_check == true || newcyberarray) {
							// console.log(en1);
							en1 = value.name.split('*')[0].toLowerCase().trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
							if (evalrace.includes(en1)) {
								// console.log('in there dummy');
							} else {
								evalrace[i]=en1;
								i = i+1;								
							}
						}	
					}
					
				}
			}
		} else {		
			if (racecompl) {
				// Check to see if the Race includes things that the IF can't have //
				
				var ppe_check = racecompl.includes(rppe) // see if the race has the value
				var isp_check = racecompl.includes(risp) //see if the race has the value
				var cyber_check = racecompl.includes(rcyber) //see if the race has the value
				var nsb_check = racecompl.includes(rnsb) //see if the race has the value
				var bp_check = racecompl.includes(rbp) //see if the race has the value				
	
				// Check the Race and make sure it can be used. If it can't, grey it out from the list. Allow them to select None, to reset the list.
				var i = 0;
				
				for (const [key, value] of Object.entries(fullsys)) { //Loop through the race values. We want to know which races an Iconic Framework can't have.			
					if (value.edges) { //Complications exist on the character
						for (const [k, v] of Object.entries(value.edges)) {
							// console.log('Key: '+k);
							// console.log('Vlaue:' +v.toLowerCase());
							if (ppe_check == true) {
								var ppetest = comptypearray.includes(v.toLowerCase());	
								// Check if the race can use this 
							}	

							if (isp_check == true) {
								var isptest = comptypearray2.includes(v.toLowerCase());		
							}											
							
							if (nsb_check == true) {
								var nsbtest = comptypearray3.includes(v.toLowerCase());		
							}						
							
							if (bp_check == true) {
								var bptest = comptypearray4.includes(v.toLowerCase());		
							}

							if (newcyberarray) {
							}

							if (ppe_check==true || isp_check==true || nsb_check == true || bp_check == true || newcyberarray) {
								
								// console.log (value.name);
								// We need to determine if the IF has this edge
								if (!evalrace.includes(value.name)) {
									evalrace[i]=value.name;	
									i=i+1;
								}
							}	
						}
						
					}
				}
			}
		}		

		dislist44 = Object.values(listsys).filter(slots => slots.disabled.toString().toLowerCase() == 'true'); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
				
		
		for (const [key, value] of Object.entries(dislist44)) {
			value['disabled'] = false //Set disabled for this element to false
		}					
		
		if (evalrace) {
			for (const [k, v] of Object.entries(evalrace)) {
				var dislist44 = Object.values(listsys).filter(slots => slots.class.toString().toLowerCase() == v.toLowerCase()); 					
				
				// Convert the iconic framework list to an array and filter for any entries that match the new framework selected.	
				for (const [k1, v1] of Object.entries(dislist44)) {
					v1['disabled'] = true //Set disabled for this element to true							
				}
			}
		}
		return;
	},

	fwreset: function(fwname, fw) {
		var dislist, exedg, exhind, i, cgtr1=[], cgtr2=[], newclass;
		
		dislist = Object.values(fwname).filter(slots => slots.disabled.toString().toLowerCase() == 'true'); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
				
		for (const [key, value] of Object.entries(dislist)) {
			value['disabled'] = false //Set disabled for this element to false
		}
		
		exedg = this.get('char.custom.cgedges');
		exhind = this.get('char.custom.cghind');

		i = 0;		
		if ( fw=='icf' ) {
			for (const[ed, desc] of Object.entries(exedg)) {
				if (desc['class'].endsWith('*^')) {
					cgtr1[i]=[];
					newclass = desc['class'].split('*')[0].trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					newclass =  newclass+"^";
					cgtr1[i]['class']=newclass;
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('^')) {
					cgtr1[i] = [];
					cgtr1[i]['class']=desc['class'];
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				}
			}
		} else if ( fw=='race') {
			for (const[ed, desc] of Object.entries(exedg)) {
				if (desc['class'].endsWith('*^')) {
					cgtr1[i]=[];
					newclass = desc['class'].split('*')[0].trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					newclass =  newclass+"*";						
					cgtr1[i]['class']=newclass;
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('*')) {
					cgtr1[i]=[];
					cgtr1[i]['class']=desc['class'];
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				}
			}
		}
		
		i = 0;		
		if ( fw=='icf' ) {
			for (const[ed, desc] of Object.entries(exhind)) {
				if (desc['class'].endsWith('*^')) {
					cgtr1[i]=[];
					newclass = desc['class'].split('*^')[0].trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					newclass =  newclass+"^";
					cgtr1[i]['class']=newclass;
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('^')) {
					cgtr2[i] = [];
					cgtr2[i]['class']=desc['class'];
					cgtr2[i]['name']=desc['name'];
					cgtr2[i]['rating']=desc['rating'];
					i=i+1;
				}
			}
		} else if ( fw=='race') {
			for (const[ed, desc] of Object.entries(exhind)) {
				if (desc['class'].endsWith('*^')) {
					cgtr1[i]=[];
					newclass = desc['class'].split('*^')[0].trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					newclass =  newclass+"*";
					cgtr1[i]['class']=newclass;
					cgtr1[i]['name']=desc['name'];
					cgtr1[i]['rating']=desc['rating'];
					i=i+1;
				} else if (desc['class'].endsWith('*')) {
					cgtr2[i]=[];
					cgtr2[i]['class']=desc['class'];
					cgtr2[i]['name']=desc['name'];
					cgtr2[i]['rating']=desc['rating'];
					i=i+1;
				}
			}
		}

		this.resetcounter(fwname);
		this.set('char.custom.cgedges', cgtr1); //Send the new array back to the page for nice display. 		
		this.set('char.custom.cghind', cgtr2); //Send the new array back to the page for nice display.
		
		return;
	},
	
	resetcounter: function(fwname) {
		var charcgp, racecgp, cgslots, newicfpoints, newifpoints, newracepoints, newrcpoints, newrating, raceval, icfval, newicf, newrace;
		charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
		racecgp = this.get('char.custom.initracepoints'); // An array of all races and values.
		cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
		newicf = this.get('char.custom.charicf');
		newrace = this.get('char.custom.charrace');
		newrating = 0;
		
		console.log(cgslots);
		
		if (newicf['class'].toLowerCase() != 'none') {
			newicfpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == newicf['class'].toLowerCase()); // Convert charcgp to an array and filter for any entries that match the new framework selected.	
			icfval = newicf['class'].toLowerCase();
		}
		
		if (newrace['class'].toLowerCase() != 'none') {
			newracepoints = Object.values(racecgp).filter(slots => slots.ifname.toString() == newrace['class'].toLowerCase()); // Convert charcgp to an array and filter for any entries that match the new framework selected.	
			raceval = newrace['class'].toLowerCase();
		}
		
		for (const [key, value] of Object.entries(cgslots)) { //Loop through the init values. This is our yardstick.
			newrating = 0;
			newrcpoints = Object.values(racecgp).filter(slots => slots.ifname.toString() == raceval); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			if (Object.keys(newrcpoints).length === 0) { // If it isn't, do this.
				newrating = value['rating'] + value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
			} else {
				for (const [key1, value1] of Object.entries(newrcpoints)) {
					newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
				}
			}
			
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == icfval); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			if (Object.keys(newifpoints).length === 0) { // If it isn't, do this.
				newrating = value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
			} else {
				for (const [key1, value1] of Object.entries(newifpoints)) {
					newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
				}
			}

			document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.		
		}
	
	},
  
	actions: {
		iconicfChanged(val) {
			var charif, charcgp, chosenifarray, cgslots, newifpoints, newval, resetifpoints, newrating, cgedg, cghind, swiconicf, swiconicfall, dislist44, newedgarray, newhindarray, newcyberarray, racecompl, sysedg, syshind, swrace, swraceall, newtrait;

			// Common things to do 
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charicf', val) //Set the selected Iconic Framework on the site.
			
			swiconicfall = this.get('char.custom.sysiconicf');	// Get all the Iconic Frameworks.
			swraceall = this.get('char.custom.swrifts_race'); // Get all the system races.			
			sysedg = this.get('char.custom.sysedges'); // Get all the System Edges
			syshind = this.get('char.custom.swsyshind');// Get all the System Hinderances		
			cgedg = this.get('char.custom.cgedges'); // Get the edges on the character now.
			newval = val['name'].split('~')[0].toLowerCase().trim(); //Take whatever Iconic Framework has been selected and chop every from ~ in the name, remove the trailing space.			
			
			swiconicf = this.get('char.custom.iconicf'); // Get the iconic frameworks formatted for drop down. This is needed to send the updated races back to the page for selection.		
			swrace = this.get('char.custom.cgrace'); // Get the system races formatted for drop down. This is needed to send the updated races back to the page for selection.		
			cghind = this.get('char.custom.cghind'); // Hinderances on the Character.


			// If the None option is selected, reset the lists.
			if (val.class.toLowerCase() == 'none') {
				// Need to reset the ICF dropdown if this is the case.
				this.fwreset(swrace, 'icf');
				return;
			}			

			chosenifarray = swiconicfall.filter(slots => slots.name.toString().toLowerCase() == newval); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			
			newedgarray = chosenifarray[0].edges; // Select the edges for the new if
			newhindarray = chosenifarray[0].hinderances; // Select the hinderances for the new if
			newcyberarray = chosenifarray[0].cybernetics; // Select the cybernetics for the new if
			racecompl = chosenifarray[0].complications;	

			// Check race
			var newtrait;
			newtrait = this.checktrait(swraceall, swiconicfall, swrace, swiconicf, chosenifarray, newval, 'icf');			
			
			// Change the Edges set by the iconicf.		
			var newedg;		
			newedg = this.changedges(sysedg, newedgarray, 'edge', 'icf');
			
			// Change the Hinderances set by the iconicf.
			var newhind;	
			// newhind = this.changehind(syshind, newhindarray, 'icf');
			newhind = this.changedges(syshind, newhindarray, 'hind', 'icf');			
					
			//Modify the CGen counters
			charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
			cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
			
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == newval); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			for (const [key, value] of Object.entries(cgslots)) { //Loop through the init values. This is our yardstick.
				resetifpoints = newifpoints.filter(slots => slots.name.toString() == value['class']);  // Test to see if the slot is modified by the Iconic Framework. 
				
				if (Object.keys(resetifpoints).length === 0) { // If it isn't, do this.
				
					newrating = value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
				} else {
					for (const [key1, value1] of Object.entries(resetifpoints)) {
						//console.log ('newrating='+value1['rating']+'+'+value['value']);
						newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
					}
				}
				document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.
			}
		},
		
		newRaceChanged(val) {
			var charif, charcgp, charrace, cgslots, newifpoints, newval, resetifpoints, newrating, cgedg, cghind, swiconicf, swiconicfall, dislist, chosenifarray, newedgarray, newhindarray, sysedg, syshind, swrace, swraceall, newcyberarray, racecompl, newtrait;

			charrace = this.get('char.custom.charrace');  //Get the value that was selected in the dropdown.	
			
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charrace', val); //Set the selected Race on the site.
			swiconicfall = this.get('char.custom.sysiconicf');	// Get all the Iconic Frameworks.
			swraceall = this.get('char.custom.swrifts_race'); // Get all the system races.			
			sysedg = this.get('char.custom.sysedges'); // Get all the System Edges
			syshind = this.get('char.custom.swsyshind');// Get all the System Hinderances		
			cgedg = this.get('char.custom.cgedges'); // Get the edges on the character now.

			// Common things to do 
			newval = val['name'].split('~')[0].toLowerCase().trim(); //Take whatever Race has been selected and chop every from ~ in the name, remove the trailing space.

			swiconicf = this.get('char.custom.iconicf'); // Get the system iconic frameworks formatted for drop down. This is needed to send the updated races back to the page for selection.			
			swrace = this.get('char.custom.cgrace'); // Get the system races. This is needed to send the updated races back to the page for selection.	
			
			cghind = this.get('char.custom.cghind'); // Hinderances on the Character. 		
			
			// If the None option is selected, reset the lists.
			if (val.class.toLowerCase() == 'none') {
				// Need to reset the ICF dropdown if this is the case.
				this.fwreset(swiconicf, 'race');
				return;
			}	
			
			this.set('char.custom.charrace', val) //Set the Race to the chosen race	

			chosenifarray = swraceall.filter(slots => slots.name.toString().toLowerCase() == newval); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			
			newedgarray = chosenifarray[0].edges; // Select the edges for the new if
			newhindarray = chosenifarray[0].hinderances; // Select the hinderances for the new if
			newcyberarray = chosenifarray[0].cybernetics; // Select the cybernetics for the new if
			racecompl = chosenifarray[0].complications;			
			
			// I/F Check 
			newtrait = this.checktrait(swraceall, swiconicfall, swrace, swiconicf, chosenifarray, newval, 'race');		


			// Change the Edges set by the race.
			
			var newedg;		
			newedg = this.changedges(sysedg, newedgarray, 'edge', 'race');
			
			// Change the Hinderances set by the race.
			var newhind;	
			newhind = this.changedges(syshind, newhindarray, 'hind', 'race');						
			//Modify the CGen counters
			
			charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
			cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == newval); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			 
			for (const [key, value] of Object.entries(cgslots)) { //Loop through the init values. This is our yardstick.
				resetifpoints = newifpoints.filter(slots => slots.name.toString() == value['class']);  // Test to see if the slot is modified by the Iconic Framework. 
				if (Object.keys(resetifpoints).length === 0) { // If it isn't, do this.
					//console.log ('newrating='+value['rating']);
					newrating = value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
				} else {
					for (const [key1, value1] of Object.entries(resetifpoints)) {
						//console.log ('newrating='+value1['rating']+'+'+value['value']);
						newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
					}
				}
				document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.
			}
		},
		
		edgeChanged(val) {
			var sysedges, charedges, charedgesall, dislist, dislist33, trexcludes, nonfwedges;
			sysedges = this.get('char.custom.sysedges');
			charedges = this.get('char.custom.cgedges');
			charedgesall = this.get('char.custom.cgedgesfw');
			nonfwedges = this.get('char.custom.cgedgesnofw');
			
			// Reset the non-framework and race edges on the character.	
			for (const[k3, v3] of Object.entries(nonfwedges)) {
				v3['disabled']=false;
				dislist = Object.values(sysedges).filter(slots => slots.name.toString().toLowerCase() == v3['name'].toLowerCase());
				dislist[0]['disabled'] = false;
				if (dislist[0]['trexcludes'].length > 0) {
					trexcludes = this.ck_includes(dislist, sysedges, 'edge');
				}				
			}
			
			for (const[k1, v1] of Object.entries(charedges)) {			
				if (!v1['class'].endsWith('*^') && !v1['class'].endsWith('*') && !v1['class'].endsWith('^') ) {
					dislist33 = Object.values(val).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
					if (dislist33.length < 1) {
						v1['disabled'] = false;
						dislist = Object.values(sysedges).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
						dislist[0]['disabled'] = false;
						if (dislist[0]['trexcludes'].length > 0) {
							trexcludes = this.ck_includes(dislist, sysedges, 'edge');
						}						
					}
				}
			}
			
			for (const [key, value] of Object.entries(val)) {
				value['disabled']=false;				
				dislist = Object.values(sysedges).filter(slots => slots.name.toString().toLowerCase() == value['name'].toLowerCase()); // Convert sysedges to an array and filter for any entries that match the new framework selected.
				dislist[0]['disabled'] = true;
			}
			this.set('char.custom.cgedgesnofw', val);
		},	
		
		hindChanged(val) {
			var syshind, charhind, dislist, dislist33, trexcludes, nofwhind;
			syshind = this.get('char.custom.swsyshind');
			charhind = this.get('char.custom.cghind');
			nofwhind = this.get('char.custom.cghindnofw');
		
			
			// Reset all hinderances to available.	
			for (const[k3, v3] of Object.entries(nofwhind)) {
				v3['disabled']=false;
				dislist = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == v3['name'].toLowerCase());
				dislist[0]['disabled'] = false;
				if (dislist[0]['trexcludes'].length > 0) {
					trexcludes = this.ck_includes(dislist, syshind, 'hind');
				}					
			}
			
			// What is this really supposed to do now?
			
			for (const[k1, v1] of Object.entries(charhind)) {
				if (!v1['class'].endsWith('*^') && !v1['class'].endsWith('*') && !v1['class'].endsWith('^') ) {
					dislist33 = Object.values(val).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
					if (dislist33.length < 1) {
						v1['disabled'] = false;
						dislist = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == v1['name'].toLowerCase());
						dislist[0]['disabled'] = false;
						if (dislist[0]['trexcludes'].length > 0) {
							trexcludes = this.ck_includes(dislist, syshind, 'hind');
						}						
					}
				}
			}
			
			for (const [key, value] of Object.entries(val)) {
				dislist = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == value['name'].toLowerCase()); // Convert sysedges to an array and filter for any entries that match the new framework selected.
				dislist[0]['disabled'] = true;
				// Check to see the Hinderance excludes others and mark them as disabled.
				if (dislist[0]['trexcludes'].length > 0) {
					trexcludes = this.ck_excludes(dislist, syshind, 'hind');
				}
			}
			
			this.set('char.custom.cghindnofw', val);
		},
		
		hjtables(val) {
			console.log(val);
			// this.set('char.custom.hjslots', val);
		},
		
	}
  
});
