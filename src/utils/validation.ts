import { z } from "zod";
import { ErrorMessages as e } from "../consts";
import { Role } from "../types/user";
import { ValidationError } from "./errors";

export const validateId = (id: string) => {
	if (!id) {
		throw new Error(e.ID_NOT_PROVIDED_ERROR);
	}
	z.string()
		.regex(/^[0-9a-fA-F]{24}$/, e.ID_INVALID_ERROR)
		.parse(id);
	return id;
};

export const validateRole = (role: string) => {
	if (!role) {
		throw new Error(e.ROLE_NOT_PROVIDED_ERROR);
	}
	const roleValues = Object.values(Role);
	if (!roleValues.includes(role as Role)) {
		throw new ValidationError(e.ROLE_INVALID_ERROR);
	}
	return role;
};
