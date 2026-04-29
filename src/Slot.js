export class Slot{
  constructor(){
    this.isRunning = false;
  }

  async init(){

  }

  spin(){
    if(this.isRunning) return;
    this.isRunning = true;
    console.log('spin');



    
    
    
    
    this.isRunning = false;
  }
}