import { ApplyRepository }
from "../repositories/apply.repository";

import type {
  ApplyPayload,
  UploadFiles,
} from "../types/apply.types";

export const ApplyService = {

  submit(
    token: string,
    payload: ApplyPayload,
    files: UploadFiles
  ) {
    return ApplyRepository.submit(
      token,
      payload,
      files
    );
  },

  getMyApplications(
    token: string
  ) {
    return ApplyRepository
      .getMyApplications(token);
  },

  getDetail(
    token: string,
    id: number
  ) {
    return ApplyRepository
      .getDetail(token, id);
  },

  getProfile(
    token: string
  ) {
    return ApplyRepository
      .getProfile(token);
  },

  getJobs() {
    return ApplyRepository
      .getJobs();
  },
};