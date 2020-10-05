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
			var charif, charcgp, cgslots, newifpoints, newval;
			charif = this.get('char.custom.chariconicf');
			this.set('char.custom.chariconicf', val)
			newval = val.split('~')[0].toLowerCase();
			console.log(newval);			
			charcgp = this.get('char.custom.inicgpoints');  // This is the array of all the if's and values
			cgslots = this.get('char.custom.cgslots');  // This is the cgslots at init and their values.
			console.log ('CGslots: '+typeof cgslots);
			//newifpoints = cgslots.filter(item => item['ifname'] == 'dragon_juicer');
			newifpoints = Object.values(charcgp).filter(slots => slots.ifname == 'dragon juicer')
			console.log (newifpoints);
			//console.log (cgslots);
			//console.log (cgslots);
			//for (const [key, value] of Object.entries(cgslots)) {
				//console.log ("Slot: " +value['name'] +"- Value: "+value['value']);
			//}
			// for (const [key, value] of Object.entries(cgslots)) {
				// console.log(`Key: ${key}: ${value}`); 
				// for (const [key1, value1] of Object.entries(value)) {
					// console.log ("Key1: "+key+" Value1:" +value)
					//console.log ("inp-" + value['name'] + "=" + value['rating'])
					//document.getElementById("inp-" + value['name']).value = value['rating']
				// }
			// }
			//get back the chargen points for the iconicframework
			//get the current chargen points.
			//add the if points to the current points
			//update each of the input fields.			
		},
		
		raceChanged(val) {
			var charrace;
			charrace = this.get('char.custom.charrace');
			this.set('char.custom.charrace', val);
		}
	}
  
});
