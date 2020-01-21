import {
  Component
} from '@angular/core';
import { Schema, ModelService } from '@enexus/flipper-offline-database';
import { Business } from '@enexus/flipper-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  constructor(private schema: Schema, private model: ModelService) {
    // this.schema.createDb('db', 'LOCALSTORAGE');


    // this.schema.create('db.business',
    // ` id int(11) NOT NULL AUTO_INCREMENT,
    //   name STRING,
    //   active BOOL,
    //   PRIMARY KEY (id)`);

      // this.schema.create('flipper.branches',
      // ` id int(11) NOT NULL AUTO_INCREMENT,
      //   name STRING,
      //   active BOOL,
      //   PRIMARY KEY (id)`);

    // console.log(this.model.select('flipper.business')
    //   .where('id', 34).
    //   orWhere('name', 'yegobox')
    //   .get());

      // console.log(this.schema.show('flipper'));
        // this.schema.rename('flipper.business','flipper.buss');


    //  console.log(this.model.create<Business>('db.business',[{
    //   name: 'La grace',
    //   active: false
    // },
    // {
    //   name: 'The grace',
    //   active: false
    // }]));

    //  console.log( this.model.update<Business>('db.business',{
    //   name: 'yegobox',
    //   active: true
    // },19));

      // this.model.truncate('flipper.business');



  }

  viewImageUploaded(src){
console.log(src);
  }
}
