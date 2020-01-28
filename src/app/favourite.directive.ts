import {Directive, HostBinding,Input} from '@angular/core';

@Directive({
    selector : '[mwFavourite]'
})

export class FavouriteDirective{
    @HostBinding('class.is-favourite') isFavourite = true;
    @Input() set mwFavourite(value){
        this.isFavourite = value;
    }
}