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
			var charif, charcgp;
			charif = this.get('char.custom.chariconicf');
			this.set('char.custom.chariconicf', val)
			charcgp = this.get('char.custom.inicgpoints');
			console.log (charcgp)
			for (const [key, value] of Object.entries(charcgp)) {
				console.log(`Key: ${key}: ${value}`); 
				for (const [key1, value1] of Object.entries(value)) {
					console.log ("Key: "+key['name']+" Rating:" +key['rating'])
					//console.log ("inp-" + value1 + "=" + value1)
					// if (key1 == 'rating') {
						// document.getElementById("inp-" + key).value = value1
						// console.log(`${key1}: ${value1}`);
					// }
				}
			}
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
