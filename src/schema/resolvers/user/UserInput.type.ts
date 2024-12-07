import { InputType, Field } from "type-graphql";
import { Length, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "../../enums/UserRole";

@InputType()
export class RegisterInput {
  @Field(() => String)
  @IsNotEmpty()
  @Length(3, 30)
  username!: string;

  @Field(() => String)
  @IsNotEmpty()
  @Length(8, 50)
  password!: string;

  @Field(() => UserRole, { nullable: true }) // Use the enum for roles
  @IsEnum(UserRole, { message: "Role must be either ADMIN or USER" }) // Validate against the enum
  @IsOptional() // Allow this field to be omitted; defaults to USER
  role?: UserRole = UserRole.USER; // Default to USER if not provided
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsNotEmpty()
  username!: string;

  @Field(() => String)
  @IsNotEmpty()
  password!: string;
}