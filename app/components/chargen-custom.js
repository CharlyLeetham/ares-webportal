import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  
	swiconicfsel: computed(function() {
		//let list = [];
		var swiconicf;
		swiconicf = this.get('char.custom.iconicf');
		return swiconicf;
	}), 

    iconicfChanged(val) {
		var charif;
		charif = this.get('char.custom.chariconicf');
		console.log ("Charif:".charif);
        //this.set('char.custom.chariconicf', val.value);
    },
	
  
  didInsertElement: function() {
    let self = this;
    this.set('updateCallback', function() { return self.onUpdate(); } );
  },
  
  onUpdate: function() {
    // Return a hash containing your data.  Character data will be in 'char'.  For example:
    // 
    // return { goals: this.get('char.custom.goals') };
   // return { powers: this.get('char.custom.iconicf')};
  }
});
