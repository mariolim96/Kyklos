// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Greeting extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Greeting entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Greeting must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Greeting", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Greeting | null {
    return changetype<Greeting | null>(store.get_in_block("Greeting", id));
  }

  static load(id: string): Greeting | null {
    return changetype<Greeting | null>(store.get("Greeting", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get sender(): string {
    let value = this.get("sender");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set sender(value: string) {
    this.set("sender", Value.fromString(value));
  }

  get greeting(): string {
    let value = this.get("greeting");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set greeting(value: string) {
    this.set("greeting", Value.fromString(value));
  }

  get premium(): boolean {
    let value = this.get("premium");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set premium(value: boolean) {
    this.set("premium", Value.fromBoolean(value));
  }

  get value(): BigInt | null {
    let value = this.get("value");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set value(value: BigInt | null) {
    if (!value) {
      this.unset("value");
    } else {
      this.set("value", Value.fromBigInt(<BigInt>value));
    }
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get transactionHash(): string {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set transactionHash(value: string) {
    this.set("transactionHash", Value.fromString(value));
  }
}

export class Sender extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Sender entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Sender must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Sender", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Sender | null {
    return changetype<Sender | null>(store.get_in_block("Sender", id));
  }

  static load(id: string): Sender | null {
    return changetype<Sender | null>(store.get("Sender", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get greetings(): GreetingLoader {
    return new GreetingLoader(
      "Sender",
      this.get("id")!.toString(),
      "greetings"
    );
  }

  get createdAt(): BigInt {
    let value = this.get("createdAt");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set createdAt(value: BigInt) {
    this.set("createdAt", Value.fromBigInt(value));
  }

  get greetingCount(): BigInt {
    let value = this.get("greetingCount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set greetingCount(value: BigInt) {
    this.set("greetingCount", Value.fromBigInt(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type User must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("User", id.toString(), this);
    }
  }

  static loadInBlock(id: string): User | null {
    return changetype<User | null>(store.get_in_block("User", id));
  }

  static load(id: string): User | null {
    return changetype<User | null>(store.get("User", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get projectsOwned(): ProjectLoader {
    return new ProjectLoader(
      "User",
      this.get("id")!.toString(),
      "projectsOwned"
    );
  }

  get projectsCreated(): ProjectLoader {
    return new ProjectLoader(
      "User",
      this.get("id")!.toString(),
      "projectsCreated"
    );
  }
}

export class Project extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Project entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Project must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Project", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Project | null {
    return changetype<Project | null>(store.get_in_block("Project", id));
  }

  static load(id: string): Project | null {
    return changetype<Project | null>(store.get("Project", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get creator(): string {
    let value = this.get("creator");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set creator(value: string) {
    this.set("creator", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get tx(): string | null {
    let value = this.get("tx");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set tx(value: string | null) {
    if (!value) {
      this.unset("tx");
    } else {
      this.set("tx", Value.fromString(<string>value));
    }
  }

  get projectId(): string {
    let value = this.get("projectId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set projectId(value: string) {
    this.set("projectId", Value.fromString(value));
  }

  get vintages(): ProjectVintageLoader {
    return new ProjectVintageLoader(
      "Project",
      this.get("id")!.toString(),
      "vintages"
    );
  }

  get standard(): string {
    let value = this.get("standard");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set standard(value: string) {
    this.set("standard", Value.fromString(value));
  }

  get methodology(): string {
    let value = this.get("methodology");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set methodology(value: string) {
    this.set("methodology", Value.fromString(value));
  }

  get region(): string {
    let value = this.get("region");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set region(value: string) {
    this.set("region", Value.fromString(value));
  }

  get storageMethod(): string {
    let value = this.get("storageMethod");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set storageMethod(value: string) {
    this.set("storageMethod", Value.fromString(value));
  }

  get method(): string {
    let value = this.get("method");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set method(value: string) {
    this.set("method", Value.fromString(value));
  }

  get emissionType(): string {
    let value = this.get("emissionType");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set emissionType(value: string) {
    this.set("emissionType", Value.fromString(value));
  }

  get category(): string {
    let value = this.get("category");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set category(value: string) {
    this.set("category", Value.fromString(value));
  }

  get uri(): string {
    let value = this.get("uri");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set uri(value: string) {
    this.set("uri", Value.fromString(value));
  }
}

export class ProjectVintage extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ProjectVintage entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ProjectVintage must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ProjectVintage", id.toString(), this);
    }
  }

  static loadInBlock(id: string): ProjectVintage | null {
    return changetype<ProjectVintage | null>(
      store.get_in_block("ProjectVintage", id)
    );
  }

  static load(id: string): ProjectVintage | null {
    return changetype<ProjectVintage | null>(store.get("ProjectVintage", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get creator(): string {
    let value = this.get("creator");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set creator(value: string) {
    this.set("creator", Value.fromString(value));
  }

  get owner(): string {
    let value = this.get("owner");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set owner(value: string) {
    this.set("owner", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get tx(): string {
    let value = this.get("tx");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set tx(value: string) {
    this.set("tx", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get startTime(): BigInt {
    let value = this.get("startTime");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set startTime(value: BigInt) {
    this.set("startTime", Value.fromBigInt(value));
  }

  get endTime(): BigInt {
    let value = this.get("endTime");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set endTime(value: BigInt) {
    this.set("endTime", Value.fromBigInt(value));
  }

  get project(): string | null {
    let value = this.get("project");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set project(value: string | null) {
    if (!value) {
      this.unset("project");
    } else {
      this.set("project", Value.fromString(<string>value));
    }
  }

  get totalVintageQuantity(): BigInt {
    let value = this.get("totalVintageQuantity");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set totalVintageQuantity(value: BigInt) {
    this.set("totalVintageQuantity", Value.fromBigInt(value));
  }

  get isCorsiaCompliant(): boolean {
    let value = this.get("isCorsiaCompliant");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set isCorsiaCompliant(value: boolean) {
    this.set("isCorsiaCompliant", Value.fromBoolean(value));
  }

  get isCCCompliant(): boolean {
    let value = this.get("isCCCompliant");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set isCCCompliant(value: boolean) {
    this.set("isCCCompliant", Value.fromBoolean(value));
  }

  get coBenefits(): string {
    let value = this.get("coBenefits");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set coBenefits(value: string) {
    this.set("coBenefits", Value.fromString(value));
  }

  get corresAdjustment(): string {
    let value = this.get("corresAdjustment");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set corresAdjustment(value: string) {
    this.set("corresAdjustment", Value.fromString(value));
  }

  get additionalCertification(): string {
    let value = this.get("additionalCertification");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set additionalCertification(value: string) {
    this.set("additionalCertification", Value.fromString(value));
  }
}

export class GreetingLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): Greeting[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<Greeting[]>(value);
  }
}

export class ProjectLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): Project[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<Project[]>(value);
  }
}

export class ProjectVintageLoader extends Entity {
  _entity: string;
  _field: string;
  _id: string;

  constructor(entity: string, id: string, field: string) {
    super();
    this._entity = entity;
    this._id = id;
    this._field = field;
  }

  load(): ProjectVintage[] {
    let value = store.loadRelated(this._entity, this._id, this._field);
    return changetype<ProjectVintage[]>(value);
  }
}
