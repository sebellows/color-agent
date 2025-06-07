/* Generates a uuidv7 value with millisecond precision.
   Source: https://github.com/dverite/postgres-uuidv7-sql
 */
CREATE OR REPLACE FUNCTION
  uuidv7(timestamptz DEFAULT clock_timestamp())
RETURNS
  uuid
AS $$
  -- Replace the first 48 bits of a uuidv4 with the current
  -- number of milliseconds since 1970-01-01 UTC
  -- and set the "ver" field to 7 by setting additional bits
  select encode(
    set_bit(
      set_bit(
        overlay(uuid_send(gen_random_uuid()) placing
	  substring(int8send((extract(epoch from $1)*1000)::bigint) from 3)
	  from 1 for 6),
	52, 1),
      53, 1), 'hex')::uuid;
$$ LANGUAGE sql volatile parallel safe;
