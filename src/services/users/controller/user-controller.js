import response from "../../../utils/response.js";
import UserRepositories from "../repositories/user-repository.js";
import { InvariantError, NotFoundError } from "../../../exceptions/index.js";

export const createUser = async (req, res, next) => {
  const { username, password, fullname } = req.validated;

  const isUsernameExist = await UserRepositories.verifyNewUsername(username);
  if (isUsernameExist) {
    return next(
      new InvariantError("Gagal menambahkan user. Username sudah digunakan."),
    );
  }

  const user = await UserRepositories.createUser({
    username,
    password,
    fullname,
  });

  if (!user) {
    return next(new InvariantError("User gagal ditambahkan"));
  }
  return response(res, 201, "User berhasil ditambahkan", user);
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await UserRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError("User tidak ditemukan"));
  }
  return response(res, 200, "User berhasil ditampilkan", { user });
};

export const getUserByUsername = async (req, res, next) => {
  const { username } = req.query;
  const users = await UserRepositories.getUsersByUsername(username);

  if (!users) {
    return next(new NotFoundError("User tidak ditemukan"));
  }

  return response(res, 200, "User berhasil ditampilkan", { users });
};
