﻿import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { RoleServiceProxy, CreateRoleDto, ListResultDtoOfPermissionDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'ww-create-role-modal',
  templateUrl: './create-role.component.html'
})
export class CreateRoleComponent extends AppComponentBase implements OnInit {
  @ViewChild('createRoleModal') modal: ModalDirective;
  @ViewChild('modalContent') modalContent: ElementRef;

  active = false;
  saving = false;

  permissions: ListResultDtoOfPermissionDto = null;
  role: CreateRoleDto = null;

  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  constructor(injector: Injector,
              private _roleService: RoleServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this._roleService.getAllPermissions()
      .subscribe((permissions: ListResultDtoOfPermissionDto) => {
        this.permissions = permissions;
      });
  }

  show(): void {
    this.active = true;
    this.role = new CreateRoleDto();
    this.role.init({isStatic: false});

    this.modal.show();
  }

  onShown(): void {
    $.AdminBSB.input.activate($(this.modalContent.nativeElement));
  }

  save(): void {
    const permissions = [];
    $(this.modalContent.nativeElement).find('[name=permission]').each(
      (index: number, elem: Element) => {
        if ($(elem).is(':checked')) {
          permissions.push(elem.getAttribute('value').valueOf());
        }
      }
    );

    this.role.permissions = permissions;

    this.saving = true;
    this._roleService.create(this.role)
      .finally(() => {
        this.saving = false;
      })
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.close();
        this.modalSave.emit(null);
      });
  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
