import { LightningElement, wire, track} from 'lwc';
import getCasesScada from '@salesforce/apex/scadaPanelController.getCasesScada'

export default class Table extends LightningElement {


    @track list_Cases_to_render = [];
    readytable = false;


    connectedCallback(){
        
        console.log('va a renderizar')
        this.ApiCall();

        window.addEventListener('scroll',() =>{
            const container = this.Template.queryselector('scrollBar');
            console.log('estoy haciendo scroll');
            const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        });

    };

    colums = [
        {
            Id: 0,
            label:'Case Number',
            fieldName:'CaseNumber'
        },
        {
            Id: 1,
            label:'Status',
            fieldName:'Status'
        },
        {
            Id: 2,
            label:'Occurrence_Date_Time__c',
            fieldName:'Occurrence_Date_Time__c'

        },
        {
            Id: 3,
            label:'Deadline Time',
            fieldName:'Deadline_Date_Time__c'
        },
        {
            Id: 4,
            label:'Time to Deadline',
            fieldName:'Time_to_Deadline__c'
        },
    ];

    limit_of_cases = 10;
    list_id_of_cases = [];

    ApiCall(){
        getCasesScada({casesId: this.list_id_of_cases, limitNumber: this.limit_of_cases})
        .then(result => {

            result.map(item => {
   
                   let arrayDeadLine = item['Time_to_Deadline__c'].split(":");
                   let hourToDeadLine = arrayDeadLine[1]*1;
   
                   let caseToSet = {
                       Id: item['Id'],
                       CaseNumber : item['CaseNumber'],
                       Status : item['Status'],
                       OccurrenceDateTime	 : item['Occurrence_Date_Time__c'],
                       DeadlineDateTime: item['Deadline_Date_Time__c'],
                       TimeToDeadline : item['Time_to_Deadline__c'],
   
                   };
      
                   if(hourToDeadLine > 48 ){
                       caseToSet.overlimit = true;
                   }else{
                       caseToSet.overlimit = true;
                   }
   
                  this.list_Cases_to_render.push(caseToSet);
                  console.log(`que cojones hay aqui ${this.list_Cases_to_render}`)

                   this.list_id_of_cases.push(caseToSet.Id); 
                   console.log(`que cojones hay aqui ${this.list_id_of_cases}`)

                   return {...item}
               });
              this.readytable = true; 
        })
        .catch(error =>{

            console.log(error);
        })

    }
}