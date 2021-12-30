import {
  Attachment,
  Team,
  User,
  Collection,
  Document,
  Group,
} from "@server/models";
import { can, abilities } from "./policy";
import "./apiKey";
import "./attachment";
import "./authenticationProvider";
import "./collection";
import "./document";
import "./integration";
import "./notificationSetting";
import "./pins";
import "./searchQuery";
import "./share";
import "./user";
import "./team";
import "./group";

type Policy = Record<string, boolean>;

/*
 * Given a user and a model – output an object which describes the actions the
 * user may take against the model. This serialized policy is used for testing
 * and sent in API responses to allow clients to adjust which UI is displayed.
 */
export function serialize(
  model: User,
  target: Attachment | Team | Collection | Document | User | Group | null
): Policy {
  const output = {};
  abilities.forEach((ability) => {
    if (model instanceof ability.model && target instanceof ability.target) {
      let response = true;

      try {
        response = can(model, ability.action, target);
      } catch (err) {
        response = false;
      }

      output[ability.action] = response;
    }
  });
  return output;
}
