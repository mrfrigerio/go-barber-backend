export default interface ICreateUserDTO {
  name: string
  email: string
  password: string
  password_hash?: string
}
