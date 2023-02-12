import { App } from "vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faArrowRotateRight,
  faStar as fasStar,
  faXmark,
  faSpinner,
  faPlus,
  faPen,
  faMinus,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

export default {
  install: (app: App<Element>) => {
    library.add(
      faCheck,
      faArrowRotateRight,
      fasStar,
      farStar,
      faXmark,
      faSpinner,
      faPlus,
      faPen,
      faMinus,
      faChevronLeft,
      faChevronRight,
      faChevronDown,
      faTrash,
      faUser
    );
    app.component("font-awesome-icon", FontAwesomeIcon);
  },
};
