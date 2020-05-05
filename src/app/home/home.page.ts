import { Component } from '@angular/core';

//When using capacitor, you need to import all capacitor plugins
import { Plugins } from '@capacitor/core';
 //And then extract what you need from the plugins object
const { LocalNotifications, Clipboard, Modals } = Plugins;

// Import electron service to use IPC, to get read messages in the web content which has been sent from the
// main process. Eg, listen for a function being called when a menu item is clicked.
import { ElectronService } from 'ngx-electron';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  //Dummy text variable for copying into the clipboard
  myText = 'My dummy text';
 
  constructor(private electronService: ElectronService) {

    //Check to make sure this is in fact an electron app before calling elecron related stuff
    if (this.electronService.isElectronApp) {
      
      //When the web content recieves this following event (This is being sent from index.js, from clicking a menu button)
      this.electronService.ipcRenderer.on('trigger-alert', this.showElectronAlert);

    }
  }
 
  async showElectronAlert() {
    Modals.alert({
      title: 'Hello!',
      message: 'I am from your menu :)'
    });
  }
 
  //Function to schedule a notification 5 seconds in the future
  //This does not work the best na browser, but will work best on a device or in electron
  async scheduleNotification() {
    LocalNotifications.schedule({
      notifications: [
        {
          title: 'My Test notification',
          body: 'My notificaiton content',
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 5) },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  }
 

  //Copy whatever text value from electron to the clipboard
  async copyText() {
    Clipboard.write({
      string: this.myText
    });
 
    Modals.alert({
      title: 'Ok',
      message: 'Text is in your clipboard.'
    });
  }
}