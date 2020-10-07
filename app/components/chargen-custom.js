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
	

  didInsertElement: function() {
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
  },
  
  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    // 
    // return { goals: this.get('char.custom.goals') };
	return { iconicf: this.get('char.custom.chariconicf'), race: this.get('char.custom.charrace')};
  },
  
  
	actions: {
		iconicfChanged(val) {
			var charif, charcgp, cgslots, newifpoints, newval, resetifpoints, newrating;
			charif = this.get('char.custom.charicf'); //Get the value that was selected in the dropdown.
			this.set('char.custom.charicf', val) //Set the selected Iconic Framework on the site.
			this.set('char.custom.charrace', 'None') //Set the Race to none.
			
			//Modify the CGen counters
			newval = val.split('~')[0].toLowerCase().trim(); //Take whatever Iconic Framework has been selected and chop every from ~ in the name, remove the trailing space.			
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
		},
		
		raceChanged(val) {
			var charrace, charif, charcgp, cgslots, newifpoints, newval, resetifpoints, resetracep, newrating, charracep, newrcpoints;
			
			charrace = this.get('char.custom.charrace');  //Get the value that was selected in the dropdown.
			charif = this.get('char.custom.chariconicf'); //Get the value that was selected in the dropdown.
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
				resetifpoints = newifpoints.filter(slots => slots.name.toString() == value['name']);  // Test to see if the slot is modified by the Iconic Framework. 
				if (Object.keys(resetifpoints).length === 0) { // If it isn't, do this. 
					newrating = value['value'];  // Set the value we're going to send back to the web. This is going to equal CGINIT.
				} else {
					for (const [key1, value1] of Object.entries(resetifpoints)) {
						newrating = value1['rating'] + value['value'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
					}
				}
				
				resetracep = newrcpoints.filter(slots => slots.name.toString() == value['name']);  // Test to see if the slot is modified by the Race.
				if (Object.keys(resetracep).length === 0) { // If it isn't, do this. 
					newrating = newrating;  // Set the value to newrating - which is either CGINIT or mod'd by IF.
				} else {
					for (const [key1, value1] of Object.entries(resetracep)) {
						newrating = value1['rating'];  //If there's a match, set the value to whatever is in CGINIT PLUS the iconfic framework.
					}
				}
	
				document.getElementById("inp-" + value['name']).value = newrating;  //Set the counters on the website.		
			}	
		}
	}
  
});
