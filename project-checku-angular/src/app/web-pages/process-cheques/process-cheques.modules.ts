import { ModuleWithProviders, NgModule } from '@angular/core';
import { ProcessChequesService } from './process-cheques.service';

@NgModule({})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [ProcessChequesService]
        }
    }
}