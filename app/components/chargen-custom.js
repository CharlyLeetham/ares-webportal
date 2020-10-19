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
  
  
	actions: {
		iconicfChanged(val) {
			var charif, charcgp, cgslots, newifpoints, newval, resetifpoints, newrating, cgedg, cghind, swiconicf, dislist, dislist1, en, i, cgtr1=[], cgtr2=[], chosenifarray, newedgarray, newhindarray, sysedg, syshind, swrace, sysrace, swraceall, complrace, newcomprace=[], newcyberarray;
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charicf', val) //Set the selected Iconic Framework on the site.
			swiconicf = this.get('char.custom.sysiconicf');	// Get all the Iconic Frameworks.
			swraceall = this.get('char.custom.swrifts_race'); // Get all the system races.			
			sysedg = this.get('char.custom.sysedges'); // Get all the System Edges
			syshind = this.get('char.custom.swsyshind');// Get all the System Hinderances		
			cgedg = this.get('char.custom.cgedges'); // Get the edges on the character now.

			// Common things to do 
			
			newval = val.split('~')[0].toLowerCase().trim(); //Take whatever Iconic Framework has been selected and chop every from ~ in the name, remove the trailing space.			
			
			swrace = this.get('char.custom.cgrace'); // Get the system races. IS THIS NEEDED????		
			cghind = this.get('char.custom.cghind'); // Hinderances on the Character. Is this needed????

			swiconicf = this.get('char.custom.sysiconicf');  // Get all the Iconic Frameworks. 
			
			chosenifarray = swiconicf.filter(slots => slots.name.toString().toLowerCase() == newval); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			
			newedgarray = chosenifarray[0].edges; // Select the edges for the new if
			const lowedgarray = newedgarray.map(newedgarray => newedgarray.toLowerCase());			
			newhindarray = chosenifarray[0].hinderances; // Select the hinderances for the new if
			newcyberarray = chosenifarray[0].cybernetics; // Select the cybernetics for the new if

			console.log(chosenifarray);			
			
			// Check the Race and make sure it can be used. If it can't, grey it out from the list. Allow them to select None, to reset the list.
				
			for (const [key, value] of Object.entries(swraceall)) { //Loop through the race values. We want to know which races an Iconic Framework can't have.		
				// console.log (value);
				
				complrace = value.hasOwnProperty('complications');
				if (complrace) { //Complications exist on the character
					for (const [k, v] of Object.entries(value.complications)) {
						var ppe_check = v.includes("Restricted Path PPE^") // see if the race has the value
						var isp_check = v.includes("Restricted Path ISP^") //see if the race has the value
						var cyber_check = v.includes("Cyber Resistant^") //see if the race has the value
						var nsb_check = v.includes("Non-Standard Build^") //see if the race has the value
						var bp_check = v.includes("Bizarre Physiology^") //see if the race has the value	
						if (ppe_check == true) {
							// var abmagic = edgecheck.include? "ab magic*"
							// var abmiracles = edgecheck.include? "ab miracles*"
							// if (abmagic) || (abmiracles)
								// return true
							// end
							var tester1 = lowedgarray.includes('ab miracles*');
							var testter2 = lowedgarray.includes('ab magic*');
							console.log(tester1, tester2);
						}						
						

					}					
				}
				// if (Object.values(value).indexOf("Complications")) {
					// console.log('Complications exists Key: ' +key+' Value: ');
					// console.log(value);
				// } else {
					// console.log('Key: ' +key+' Value: ');
					// console.log ("No Complications");
				// }
			}
			
			
			this.set('char.custom.charrace', 'None') //Set the Race to none.
			
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
				//console.log ("inp-" + value['class']+".value= "+newrating);
				document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.
			}
			
			// Change the Edges set by the iconicf.
	
			//Change all items in the sysedg dropdown to enabled. 	
			dislist = Object.values(sysedg).filter(slots => slots.disabled.toString().toLowerCase() == 'true'); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			for (const [key, value] of Object.entries(dislist)) {
				//console.log (value['name']+' disabled='+value['disabled']);
				value['disabled'] = false //Set disabled for this element to false
			}		

			// Clear the edges list for the framework

	
			//If there are new edges, go through and set these to disabled in the edge drop down.
			if (newedgarray) {
				i = 0;
				for (const [key, value1] of Object.entries(newedgarray)) {
					// console.log(value1);
					en = value1.split('*')[0].toLowerCase().trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					dislist = Object.values(sysedg).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
					for (const [key, value] of Object.entries(dislist)) {
						value['disabled'] = true //Set disabled for this element to true
						// Write the new CG Edges array for a nice display
						cgtr1[i]=[]
						cgtr1[i]['class'] = value1;
						cgtr1[i]['name'] = en;
						cgtr1[i]['rating'] = value['desc'];
						i=i+1
					}
				}	
			}
			this.set('char.custom.sysedges', sysedg); //Send the new dropdown back to the page. 
			this.set('char.custom.cgedges', cgtr1); //Send the new array back to the page for nice display. 
			
			// Change the Hinderances set by the iconicf.


			//Change all items in the hinderances dropdown to enabled. 
			dislist1 = Object.values(syshind).filter(slots => slots.disabled.toString().toLowerCase() == 'true'); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
			for (const [key, value] of Object.entries(dislist1)) {
				//console.log (value['name']+' disabled='+value['disabled']);
				value['disabled'] = false //Set disabled for this element to false
			}		

			//If there are new hinderances, go through and set these to disabled in the edge drop down.
			if (newhindarray) {
				i = 0;
				for (const [key, value1] of Object.entries(newhindarray)) {
					en = value1.split('*')[0].toLowerCase().trim(); // Take the trailing * from the edge for I/F's (NOTE: Need to work out Races next)
					dislist1 = Object.values(syshind).filter(slots => slots.name.toString().toLowerCase() == en); // Convert the iconic framework list to an array and filter for any entries that match the new framework selected.
					for (const [key, value] of Object.entries(dislist1)) {
						value['disabled'] = true //Set disabled for this element to true
						// Write the new CG Edges array for a nice display
						cgtr2[i]=[]
						cgtr2[i]['class'] = value1;
						cgtr2[i]['name'] = en;
						cgtr2[i]['rating'] = value['desc'];
						i=i+1
					}
				}
				
			}
			this.set('char.custom.swsyshind', syshind); //Send the new dropdown back to the page. 
			this.set('char.custom.cghind', cgtr2); //Send the new array back to the page for nice display.			
		},
		
		raceChanged(val) {
			var charrace, charif, charcgp, cgslots, newifpoints, newval, resetifpoints, resetracep, newrating, charracep, newrcpoints;
			
			charrace = this.get('char.custom.charrace');  //Get the value that was selected in the dropdown.
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charrace', val);
			
			//Modify the CGen counters for the IF
			charif = charif.split('~')[0].toLowerCase().trim(); //Take whatever IF has been set and chop every from ~ in the name, remove the trailing space.	
			newval = val.split('~')[0].toLowerCase().trim(); //Take whatever Race has been selected and chop every from ~ in the name, remove the trailing space.
			
			charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
			charracep = this.get('char.custom.initracepoints');  // This is the array of all the races and values	
			cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
			
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname.toString() == charif); // Convert charcgp to an array and filter for any entries that match the new framework selected.
			newrcpoints = Object.values(charracep).filter(slots => slots.ifname.toString() == newval); // Convert charcgp to an array and filter for any entries that match the new framework selected.

			//Reset newrating to 0 for each loop
			newrating = 0;

			for (const [key, value] of Object.entries(cgslots)) { //Loop through the init values. This is our yardstick.
				resetifpoints = newifpoints.filter(slots => slots.name.toString() == value['class']);  // Test to see if the slot is modified by the Iconic Framework. 
				if (Object.keys(resetifpoints).length === 0) { // If it isn't, do this. 
					newrating = value['rating'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
				} else {
					for (const [key1, value1] of Object.entries(resetifpoints)) {
						newrating = value1['rating'] + value['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
					}
				}
				
				resetracep = newrcpoints.filter(slots => slots.name.toString() == value['class']);  // Test to see if the slot is modified by the Race.
				if (Object.keys(resetracep).length === 0) { // If it isn't, do this. 
					newrating = newrating;  // Set the value to newrating - which is either CGINIT or mod'd by IF.
				} else {
					for (const [key1, value1] of Object.entries(resetracep)) {						
						// console.log ("inp-" + value['class']+".value= "+newrating+" + "+value1['rating']);
						newrating = value1['rating']+newrating;  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
						// console.log ("inp-" + value['class']+".value= "+newrating);						
					}
				}
	
				document.getElementById("inp-" + value['class']).value = newrating;  //Set the counters on the website.		
			}	
		},
		
		edgeChanged(val) {
			var charhind;
			// charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.cgedgesnofw', val);
		},		
		
		hindChanged(val) {
			var charhind;
			// charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.cghindnofw', val);
		}
	}
  
});
