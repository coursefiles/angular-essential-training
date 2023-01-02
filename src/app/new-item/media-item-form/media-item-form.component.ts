import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MediaItemService } from '../../media-item.service';
import { lookupListToken } from '../../providers';
import { Router } from '@angular/router';

@Component({
  selector: 'media-item-form',
  templateUrl: './media-item-form.component.html',
  styleUrls: ['./media-item-form.component.css']
})
export class MediaItemFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private mediaItemService: MediaItemService,
    @Inject(lookupListToken) public lookupLists,
    private router: Router ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      medium: this.formBuilder.control('Movies'),
      name: this.formBuilder.control('', Validators.compose([
        Validators.required,
        Validators.pattern('[\\w\\-\\s\\/]+')
      ]) ),
      category: this.formBuilder.control(''),
      year: this.formBuilder.control('', this.yearValidator),

    });
  }

// custom year valiator
  yearValidator(control: FormControl) {
    if (control.value.trim().lengh === 0) {
      return null;
    }
    const year = parseInt(control.value, 10);
    const minYear = 1800;
    const maxYear = 2500;
    if (year >= minYear && year <= maxYear) {
      return null;
    } else {
      return {
        year: {
          min: minYear,
          max: maxYear
        }
      };
    }
  }

  onSubmit(mediaItem) {
      console.log(mediaItem);
      this.mediaItemService.add(mediaItem);
      // .subscribe(() => {
      //   this.router.navigate(['/', mediaItem.medium]);
      // });
  }

}
