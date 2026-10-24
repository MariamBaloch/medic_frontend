import { apiClient } from "@services/api/axios";
import {
  availabilityExceptionDeleteSchema,
  availabilityExceptionRequestSchema,
  availabilityExceptionSchema,
  availabilityRuleChangeSchema,
  availabilityRuleDeleteSchema,
  availabilityRuleRequestSchema,
  availabilityRuleSchema,
  type AvailabilityException,
  type AvailabilityExceptionDelete,
  type AvailabilityExceptionRequest,
  type AvailabilityRule,
  type AvailabilityRuleChange,
  type AvailabilityRuleDelete,
  type AvailabilityRuleRequest,
} from "./availability.schemas";

export async function getAvailabilityRules(): Promise<AvailabilityRule[]> {
  const { data } = await apiClient.get("/doctors/availability/rules");
  return availabilityRuleSchema.array().parse(data);
}

export async function createAvailabilityRule(
  request: AvailabilityRuleRequest,
): Promise<AvailabilityRuleChange> {
  const { data } = await apiClient.post(
    "/doctors/availability/rules",
    availabilityRuleRequestSchema.parse(request),
  );
  return availabilityRuleChangeSchema.parse(data);
}

export async function updateAvailabilityRule(
  id: number,
  request: AvailabilityRuleRequest,
): Promise<AvailabilityRuleChange> {
  const { data } = await apiClient.put(
    `/doctors/availability/rules/${id}`,
    availabilityRuleRequestSchema.parse(request),
  );
  return availabilityRuleChangeSchema.parse(data);
}

export async function deleteAvailabilityRule(id: number): Promise<AvailabilityRuleDelete> {
  const { data } = await apiClient.delete(`/doctors/availability/rules/${id}`);
  return availabilityRuleDeleteSchema.parse(data);
}

export async function getAvailabilityExceptions(): Promise<AvailabilityException[]> {
  const { data } = await apiClient.get("/doctors/availability/exceptions");
  return availabilityExceptionSchema.array().parse(data);
}

export async function createAvailabilityException(
  request: AvailabilityExceptionRequest,
): Promise<AvailabilityException> {
  const { data } = await apiClient.post(
    "/doctors/availability/exceptions",
    availabilityExceptionRequestSchema.parse(request),
  );
  return availabilityExceptionSchema.parse(data);
}

export async function updateAvailabilityException(
  id: number,
  request: AvailabilityExceptionRequest,
): Promise<AvailabilityException> {
  const { data } = await apiClient.put(
    `/doctors/availability/exceptions/${id}`,
    availabilityExceptionRequestSchema.parse(request),
  );
  return availabilityExceptionSchema.parse(data);
}

export async function deleteAvailabilityException(
  id: number,
): Promise<AvailabilityExceptionDelete> {
  const { data } = await apiClient.delete(`/doctors/availability/exceptions/${id}`);
  return availabilityExceptionDeleteSchema.parse(data);
}
