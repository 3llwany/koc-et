import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: "root",
})
export class PendingChangesGuard
  implements CanDeactivate<ComponentCanDeactivate>
{
  canDeactivate(
    component: ComponentCanDeactivate
  ): boolean | Observable<boolean> {
    if (!component.canDeactivate()) {
      if (
        confirm(
          "You have unsaved changes! If you leave, your changes will be lost."
        )
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;

    // if there are no pending changes, just allow deactivation; else confirm first
    // return component.canDeactivate()
    //   ? true
    //   : confirm(
    //       "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes."
    //     );
  }
}
