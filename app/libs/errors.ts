import { Response } from '@remix-run/node';

export class NotFoundError extends Response {
  constructor(message: string) {
    super(message, { status: 404, statusText: message });
  }
}

export class ForbiddenError extends Response {
  constructor(message: string) {
    super(message, { status: 403, statusText: message });
  }
}

export class BadRequestError extends Response {
  constructor(message: string) {
    super(message, { status: 400, statusText: message });
  }
}

export class EventNotFoundError extends NotFoundError {
  constructor() {
    super('Event not found');
  }
}

export class ProposalNotFoundError extends NotFoundError {
  constructor() {
    super('Proposal not found');
  }
}

export class CfpNotOpenError extends BadRequestError {
  constructor() {
    super('CFP not open');
  }
}

export class TalkNotFoundError extends NotFoundError {
  constructor() {
    super('Talk not found');
  }
}

export class MaxSubmittedProposalsReachedError extends BadRequestError {
  constructor() {
    super('You have reached the maximum number of proposals.');
  }
}

export class SurveyNotEnabledError extends BadRequestError {
  constructor() {
    super('Survey not enabled');
  }
}

export class InvitationNotFoundError extends NotFoundError {
  constructor() {
    super('Invitation invalid');
  }
}

export class InvitationInvalidOrAccepted extends BadRequestError {
  constructor() {
    super('Invitation invalid or already accepted');
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User not found');
  }
}

export class SpeakerNotFoundError extends NotFoundError {
  constructor() {
    super('Speaker not found');
  }
}

export class OrganizationNotFoundError extends NotFoundError {
  constructor() {
    super('Organization not found');
  }
}

export class ForbiddenOperationError extends ForbiddenError {
  constructor() {
    super('Forbidden operation');
  }
}

export class ApiKeyInvalidError extends BadRequestError {
  constructor() {
    super('API key invalid');
  }
}
