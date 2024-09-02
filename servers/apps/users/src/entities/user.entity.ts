import { Directive, Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Avatar {
  @Field()
  id: string;

  @Field()
  public_id: string;

  @Field()
  url: string;

  @Field()
  userId: string;
}

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field()
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Avatar, { nullable: true })
  avatar?: Avatar | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
