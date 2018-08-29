'use babel';

import McsView from './mcs-view';
import{CompositeDisposable } from 'atom';

export default{

  mcsView:null,
  modalPanel:null,
  subscriptions:null,

  activate(state){
    this.mcsView=new McsView(state.mcsViewState);
    this.modalPanel=atom.workspace.addModalPanel({
      item:this.mcsView.getElement(),
      visible:false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions=new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace',{
      'mcs:format':()=>this.format()
    }));
  },

  deactivate(){
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mcsView.destroy();
  },

  serialize(){
    return{
      mcsViewState:this.mcsView.serialize()
    };
  },

  format(){
    let editor
    if(editor=atom.workspace.getActiveTextEditor()){
      let selection=editor.getText()
      let reversed=selection.replace(/\ ?([\(\)\[\{\;\=\,\>\:]+)\ ?/gi,'$1').replace(/(})[\ ]+/gi,'$1').replace(/\)[\s]+{/gi,'){').replace(/\s+\{/gi,'{');
      editor.setText(reversed)
    }
  }

};
