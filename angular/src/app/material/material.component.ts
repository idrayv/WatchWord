import {NgForm, NgModel} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, OnDestroy, Injector} from '@angular/core';
import {ISubscription} from 'rxjs/Subscription';
import {MaterialService} from './material.service';
import {Material as MaterialModel, MaterialMode, MaterialStats} from './material.models';
import {VocabType, VocabWordFiltration} from './material.models';
import {VocabWord} from './material.models';
import {TranslationModalService} from '../global/components/translation-modal/translation-modal.service';
import {ComponentValidation} from '../global/component-validation';
import {FavoriteMaterialsService} from '../global/favorite-materials/favorite-materils.service';
import {AppComponentBase} from '@shared/app-component-base';

declare let ga: any;

@Component({
    templateUrl: 'material.template.html'
})

export class MaterialComponent extends AppComponentBase implements OnInit, OnDestroy {
    public mode: MaterialMode = null;
    public vocabWords: VocabWord[] = [];
    public material: MaterialModel = new MaterialModel();
    public isFavorite = false;
    // public accountInformation: AccountInformation;
    public formSubmitted = false;
    public filtration: VocabWordFiltration = new VocabWordFiltration();
    private routeSubscription: ISubscription;
    private accountSubscription: ISubscription;
    private translationModalResponseSubscription: ISubscription;

    constructor(private materialService: MaterialService,
                private route: ActivatedRoute,
                private router: Router,
                private favoriteMaterialsService: FavoriteMaterialsService,
                private translationModalService: TranslationModalService,
                injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        /*this.accountSubscription = this.accountInformationService.getAccountInformationObservable().subscribe(accountInformation => {
            this.accountInformation = accountInformation;
        });*/

        this.routeSubscription = this.route.params.subscribe(params => this.onRouteChanged(params['id']));
        this.translationModalResponseSubscription = this.translationModalService.translationModalResponseObserverable
            .subscribe(response => {
                if (response.success) {
                    this.translationModalService.updateVocabWordInCollection(response.vocabWord, this.vocabWords);
                } else {
                    this.displayErrors(response.errors);
                }
            });
    }

    private onRouteChanged(param: string): void {
        if (param === 'create') {
            this.mode = MaterialMode.Add;
            this.material = new MaterialModel();
            this.vocabWords = [];
        } else if (+param) {
            this.initializeMaterial(+param);
        } else {
            this.router.navigate(['/404']);
        }
    }

    public editMaterial(): void {
        this.mode = MaterialMode.Edit;
    }

    public deleteMaterial(): void {
        abp.ui.setBusy('body');
        this.materialService.deleteMaterial(this.material.id).then(response => {
            abp.ui.clearBusy('body');
            if (response.success) {
                this.router.navigateByUrl('materials');
            } else {
                response.errors.forEach(err => this.displayError(err));
            }
        });
    }

    public saveMaterial(form: NgForm): void {
        this.formSubmitted = true;
        if (form.valid) {
            abp.ui.setBusy('body');
            this.materialService.saveMaterial(this.material, this.vocabWords).then(response => {
                abp.ui.clearBusy('body');
                if (response.success) {
                    if (this.mode === MaterialMode.Add) {
                        this.router.navigateByUrl('material/' + response.id);
                    } else {
                        this.mode = MaterialMode.Read;
                    }
                } else {
                    response.errors.forEach(err => this.displayError(err));
                }
            });
            this.formSubmitted = false;
        }
    }

    get materialStats(): MaterialStats[] {
        const stats: MaterialStats[] = [];

        const totalCount = this.material.words
            .map(w => w.count).reduce((pre, curr) => pre + curr, 0);

        const uniqueCount = this.vocabWords.length;
        this.pushStatToStats(stats, 'Total words', totalCount.toString());
        this.pushStatToStats(stats, 'Unique words', uniqueCount.toString());

        /*if (this.accountInformation.account.externalId !== 0) {
            const learnCount = this.vocabWords.filter(v => v.type === VocabType.LearnWord).length;
            const knownCount = this.vocabWords.filter(v => v.type === VocabType.KnownWord).length;

            this.pushStatToStats(stats, 'Learn words', learnCount.toString());
            this.pushStatToStats(stats, 'Known words', knownCount.toString());
            this.pushStatToStats(stats, 'Unsigned words', (uniqueCount - (learnCount + knownCount)).toString());
        }*/

        return stats;
    }

    get isEditButtonsVisible(): boolean {
        /*if (!this.accountInformation || !this.accountInformation.account || !this.material.owner) {
            return false;
        }*/

        /*return this.material.owner.externalId === this.accountInformation.account.externalId || this.accountInformation.isAdmin;*/
        return false;
    }

    get isAddToFavoritesButtonVisible(): boolean {
        /*if (!this.accountInformation || !this.accountInformation.account || this.mode === MaterialMode.Add) {
            return false;
        }*/
        return true;
    }

    public validationErrors(state: NgModel): string[] {
        return ComponentValidation.validationErrors(state);
    }

    private pushStatToStats(stats: MaterialStats[], name: string, value: string) {
        stats.push({
            name: name,
            value: value
        });
    }

    private initializeMaterial(id: number): void {
        abp.ui.setBusy('body');

        this.materialService.getMaterial(id).then(response => {
            if (response.success) {
                this.mode = MaterialMode.Read;
                this.material = response.material;
                this.vocabWords = response.vocabWords;
            } else {
                this.mode = null;
                response.errors.forEach(err => this.displayError(err));
            }

            // TODO: Wait accountSubscription
            /*if (this.accountInformation.account.name) {
                this.favoriteMaterialsService.get(this.material.id).then(res => {
                    abp.ui.clearBusy('body');
                    if (res.success) {
                        this.isFavorite = res.isFavorite;
                    } else {
                        this.displayErrors(res.errors);
                    }
                });
            }*/

            const accountName = /*this.accountInformation.account.name;*/ '';
            const materialName = this.material.name;
            ga('send', {
                hitType: 'event',
                eventCategory: 'Materials',
                eventAction: 'Visit',
                eventLabel: materialName,
                dimension1: accountName,
                dimension2: materialName,
                hitCallback: function () {
                }
            });
        });
    }

    public removeFromFavorites(): void {
        abp.ui.setBusy('body');
        this.favoriteMaterialsService.delete(this.material.id).then(resp => {
            abp.ui.clearBusy('body');
            if (resp.success) {
                this.isFavorite = !this.isFavorite;
            } else {
                this.displayErrors(resp.errors);
            }
        });
    }

    public addToFavorites(): void {
        abp.ui.setBusy('body');
        this.favoriteMaterialsService.add(this.material.id).then(resp => {
            abp.ui.clearBusy('body');
            if (resp.success) {
                this.isFavorite = !this.isFavorite;
            } else {
                this.displayErrors(resp.errors);
            }
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
        this.accountSubscription.unsubscribe();
        this.translationModalResponseSubscription.unsubscribe();
    }
}