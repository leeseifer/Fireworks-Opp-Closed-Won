import { LightningElement } from 'lwc';
import fireworks from '@salesforce/resourceUrl/fireworks';
import { loadScript } from 'lightning/platformResourceLoader';
import {subscribe} from 'lightning/empApi';
var firewo = {};
var ani = {};
export default class OppFirework extends LightningElement {
    channelName = '/event/Close_Won_Opp__e';
    options =   {   sound: {
                        enabled: true,
                        files: [
                            fireworks+'/explosion0.mp3',
                            fireworks+'/explosion1.mp3',
                            fireworks+'/explosion2.mp3'
                        ],
                        volume: {
                            min: 100,
                            max: 100
                        }
                    }
                };
    subscription = {};
    connectedCallback(){
        Promise.all([
            loadScript(this, fireworks+'/fireworks.js')
        ])
        
        .then(()=>{
            const root = this.template.querySelector('div.root');
            firewo = new Fireworks(root,this.options);
            ani = this.template.querySelector('div.ml2');
            //this.handleSubscribe();
        })
        
        this.handleSubscribe();
    }
    
    // Handles subscribe button click
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const messageCallback = function (response) {
            firewo.start();
            const myTimeout = setTimeout(function (){firewo.stop()}, 10000);
            let pEvent = response.data.payload;
            let eMessage = pEvent.Owner__c + ' has just closed '+ pEvent.Opp_Name__c +': $'+pEvent.Amount__c.toLocaleString();
            ani.innerHTML = eMessage.replace(/\S/g, "<span class='letter'>$&</span>");
            const anotherTimeout = setTimeout(function(){

            ani.innerHTML = '';},10000);
            console.log('New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
            this.subscription = response;
        });
    }
}