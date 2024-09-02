import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: "name must not be empty" })
  @IsString({ message: "name must be a string" })
  name: string;

  @Field()
  @IsNotEmpty({ message: "Phone number must not be empty" })
  @IsString({ message: "Phone number must be a string" })
  phoneNumber: string;

  @Field()
  @IsNotEmpty({ message: "Email must not be empty" })
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty({ message: "Password must not be empty" })
  @MinLength(8 , {
    message: "Password must be at least 8 characters long"
  })
  
  password: string;
}

@InputType()
export class ForgotPasswordDto {

  @Field()
  @IsNotEmpty({ message: "Email must not be empty" })
  @IsEmail()
  email: string;
}

@InputType()
export class ActivationDto {

  @Field()
  @IsNotEmpty({ message: "Activation Token must not be empty" })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: "Activation Code must not be empty" })
  activationCode: string;

}

@InputType()
export class LoginDto {

  @Field()
  @IsNotEmpty({ message: "Email must not be empty" })
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty({ message: "Password must not be empty" })
  password: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Activation Token is required.' })
  activationToken: string;
}
