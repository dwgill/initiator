import { UPDATE_COMBATANT } from "../actions/types";
import isEqual from "lodash/fp/isEqual";
import pick from "lodash/fp/pick";

const combatantsReducer = (state, { type, payload }) => {
  switch (type) {
    case UPDATE_COMBATANT: {
      const { id: combatantId } = payload;
      if (!combatantId) {
        return state;
      }

      const oldCombatant = state.combatants[combatantId];
      const newProperties = payload;
      const newPropKeys = Object.keys(newProperties);
      const oldProperties = pick(newPropKeys)(oldCombatant);
      const noDifference = isEqual(oldProperties)(newProperties);

      // prettier-ignore
      return noDifference ? state : {
        ...state,
        combatants: {
          ...state.combatants,
          [combatantId]: {
            ...oldCombatant,
            ...newProperties,
          },
        }
      };
    }
    default: {
      return state;
    }
  }
};

combatantsReducer.dependencies = [];

export default combatantsReducer;
