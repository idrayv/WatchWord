﻿import {Component, Input} from '@angular/core';
import {Word} from '../../../material/material.models';
import {TranslationModalService} from '../translation-modal/translation-modal.service';
import {VocabWord} from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'ww-word',
    templateUrl: 'word.template.html'
})

export class WordComponent {

    @Input() public vocabWord: VocabWord;
    @Input() public word: Word;

    constructor(private translationModalService: TranslationModalService) {
    }

    public getTranslation(): void {
        this.translationModalService.pushToModal(this.vocabWord.clone());
    }
}
