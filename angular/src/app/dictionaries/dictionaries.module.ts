import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionariesComponent } from './dictionaries.component';
import { DictionariesRoutingModule } from './dictionaries-routing.module';
import { TranslationModalModule } from '../global/components/translation-modal/translation-modal.module';
import { WordModule } from '../global/components/word/word.module';

@NgModule({
  imports: [CommonModule, DictionariesRoutingModule, TranslationModalModule, WordModule],
  declarations: [DictionariesComponent],
  providers: []
})
export class DictionariesModule {
}
