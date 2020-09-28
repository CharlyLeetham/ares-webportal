import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  
	swiconicfsel: computed(function() {
		//let list = [];
		var freid;
		freid = this.get('char.custom.iconicf');
		//freid = "Hello World";
		console.log (freid);
		//this.get('char.custom.iconicf').forEach(function(g) {
		  //list.push({ value: g });
		//});
		//console.alert(list);
		//return list;
		var list=["list1", "list2", "list3"];
		console.log (list);
		return freid;
	}), 

    iconicfChanged(val) {
        this.set('char.custom.iconicf.value', val.value);
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
