// Have to disable eslint because of a bug in arrow functions with type
// parameters getting fixed in a completely wrong way.
/* eslint-disable arrow-parens */

export type GetValueType<T extends {}, Prop extends string> = T extends {
  [name in Prop]: infer K
} ? K : (
    T extends {
      [name in Prop]?: infer L
    } ? L | undefined : never
  );

export function hasOwnProperty<T extends {}, Property extends string>(
  input: T,
  property: Property
): input is T & Record<Property, GetValueType<T, Property>> {
  return Object.prototype.hasOwnProperty.call(input, property);
}

export function getPropertyWithDefault<T extends {}, Property extends string, DefaultValueType>(
  input: T,
  property: Property,
  defaultTo: DefaultValueType
): GetValueType<T, Property> | DefaultValueType {
  if (hasOwnProperty(input, property)) {
    return input[property];
  }

  return defaultTo;
}

export const getPropertyOrThrow = (
  /**
   * A function that "never" returns any value, not even undefined. Provide a
   * function that throws an error for the type check to pass.
   */
  ifMissing: () => never

  // eslint-disable-next-line arrow-parens
) => <T extends {}, Property extends string>(
  input: T,
  property: Property
) => {
  if (hasOwnProperty(input, property)) {
    return input[property];
  }

  ifMissing();
};

export const getPropertyOrUndefined = <T extends {}, Property extends string>(
  input: T,
  property: Property
): GetValueType<T, Property> | undefined => {
  if (hasOwnProperty(input, property)) {
    return input[property];
  }
  return undefined;
};
