Space Invaders
==============

Space Invader game written in TypeScript with RxJS.

[Play the game](https://bbriano.github.io/spaceinvaders/)

[spaceinvaders.ts](spaceinvaders.ts)

Overview
--------

This section describes the major parts of `spaceinvaders.ts`.

	type State = Readonly<{...}>
	type Input = Readonly<{...}>

`State` stores the entire game data.
`Input` represents mouse and keyboard data.
Readonly is used to ensure variables are never modified.

	function transition(state: State, input: Input): State {...}
	function view(state: State): void {...}

`transition` returns the next state given some state and input.
`view` draws state on the svg element.

	const mouse$ = fromEvent<MouseEvent>(document, "mousemove").pipe(...)
	const keyboard$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(...)
	const input$ = merge(mouse$, keyboard$).pipe(
		bufferTime(FRAME_TIME),
		...
	)

`mouse$` and `keyboard$` are observables emmiting Mouse and Keyboard Input.
`input$` merges them together and emits an `Input` object every 10ms.
Each emission from `input$` represents one frame of the game.

	input$.pipe(scan(transition, INITIAL_STATE(""))).subscribe(view)

	                  /* starts with INITIAL_STATE */
	                           [prev state] <------+
	                                |              |
	                              State            |
	                                |              |
	                                v              |
	+--------+                +------------+       |        +------+
	| input$ | ----Input----> | transition | ----State----> | view |
	+--------+                +------------+                +------+
                                                    /* Modifies SVG Element */

And finally this is how it all fit together with scan and subscribe.
`scan` operator transforms the stream of input to a stream of states
by transducing it with the state transition function described previously.
And finally `subscribe` takes the `State` stream and pass it to `view` to display.

Functional style
----------------

An effort was made to follow functional programming principles
(purity and immutability).
All functions except for `view` are pure.
All variable including local variables are immutable.

Consider this snippet from the `transition` function:

	// newState = ammoRegen(...alienShoot(playerShoot(state, input), input)..., input)
	const newState = [
		playerShoot,
		alienShoot,
		...
		mmoRegen,
	].reduce((s, t) => t(s, input), state)

Each of `playerShoot`, `alienShoot` and so on are atomic functions
with the same type as the `transition` function.
Separating them serves no other purpose than
to make the code more isolated and extensible.
Here is one of the atomic function:

	// removeBullet removes out of screen bullets.
	function removeBullet(state: State, _: Input): State {
		return {
			...state,
			bullets: state.bullets.filter(b => b.pos.y > 0),
		}
	}

Reading the function naturally describes the what
instead of the how an action is performed (declarative over imperative).

This functional style gives great separation of concern.
For example when debugging the game,
each function can be tested independently without worrying about
any other part of the codebase.

Extension 1: From Randomness to Unpredictability
------------------------------------------------

It is desirable to have the aliens shoot at a random interval.
But random functions are not pure.
This is because pure functions must always return the same value given the same input.
This section discuses how a randomness-like feature was implemented in the game.

The solution is to use hash functions.
Hash functions returns a random-looking value given any (often string) input.
But they are pure and always return the same value given the same input.

The desired behaviour using the non-pure `Math.random` function:

	Math.random() < ALIEN_SHOOT_PROB /* shoot OR no shoot */

And here is the equivalent pure function version:

	simpleHash(JSON.stringify(state) +
		JSON.stringify(alien))/2**32 < ALIEN_SHOOT_PROB

`simpleHash` is a hash function returning an integer in `[0..2^32)`
based from bryc's comment from <https://gist.github.com/iperelivskiy/4110988>.

	function simpleHash(s: string): number {
		const hash = s.split("").reduce((acc, x) =>
			Math.imul(acc ^ x.charCodeAt(0), 2654435761),
				0xdeadbeef,
			)
		return (hash ^ hash >>> 16) >>> 0
	}

The serialized `state` acts as a seed value to generate a "random" number.
serialized `alien` is also passed so each call is unique on the alien.
Otherwise aliens would all shoot at the same time.

To iterate again there is no randomness here.
Just a trick of using pure hash functions which are hard to predict.
The user would never know.

Extension 2: Character matching
-------------------------------

This feature was added to make the game more challenging,
by adding a mechanism where user shoots letter at alien with matching letters.
Assign a letter to each Alien.
When user press keyboard keys to shoot bullets with the specific letter.
if an alien was shot with a matching letter bullet then the player gets bonus points.

Before this feature was added, all controls are made with the mouse.
So to add this feature, a new Keyboard input type was created.

	type Input = Readonly<{
		mouse?: Mouse
		keyboard?: Keyboard
	}>
    type Keyboard = Readonly<{...}>

The `merge` operator is used to combine the `mouse$` and `keyboard$` input stream.

    const input$ = merge(mouse$, keyboard$).pipe(...)

The `simpleHash` function from last section is used to initialize each alien with a random letter.
Snippet from the `INITIAL_STATE` function:

	// i and j are integer representing the alien's index
	const pseudoRandom = simpleHash(seed + JSON.stringify([i, j]))
	return {
		...
		character: ABC[pseudoRandom % ABC.length] as Character,
	} as Alien

We must filter out keys not in the alphabet in `playerShoot` atomic transition function.

	const char = input.keyboard.key.toUpperCase()
	// Only accept keys in ABC.
	if (!ABC.includes(char)) {
		return state
	}

And here is how the new score is calculated by counting how many alien
collided with bullet and accounting for matching letter (or character).

	// Calculate new score.
	const score = state.aliens.reduce((scoreA, a) => {
		return state.bullets.reduce((scoreB, b) => {
			return b.shooter !== "ALIEN" && rectangleRectangleCollide(a, b)
				? a.character === b.character
					? scoreB + SCORE_ALIEN_KILL_CHAR_MATCH
					: scoreB + SCORE_ALIEN_KILL
				: scoreB
			}, scoreA)
	}, state.score)

This feature proofs to be effective in making the game more challenging.

Extension 3: Ammunition/Ammo
----------------------------

The following is a snippet of code for removing aliens which got shot.

	// Only keep aliens that dont collide with any bullets.
	const aliens = state.aliens.filter(a =>
		!state.bullets.some(b =>
			b.shooter !== "ALIEN" && rectangleRectangleCollide(a, b)
		)
	)

It is an `O(N_ALIEN * N_BULLET)` time complexity operation.
So if the player keeps shooting and adding more bullets to the game,
the game will eventually slow down drastically making it unplayable.

Previous version used rxjs's `throttle` operator on the input stream.
This solved the too many bullet issue but makes the game feel unresponsive.

The current version implements an Ammunition (or Ammo for short) system.
So player have a finite amount of ammunition that regenerates over time.

The first implementation uses the rxjs `interval` operator.

	const ammoRegen$ = interval(2000).pipe(...)
	const input$ = merge(mouse$, keyboard$, ammoRegen$).pipe(...)

This solution works but `ammoRegen` seems out of place in the `Input` type.

	type Input = Readonly<{
		mouse?: Mouse
		keyboard?: Keyboard
		ammoRegen?: boolean // if true, regenerate ammo
	}>

So it was redesigned with an extra state variable, `ammoRegenTimer`.
`ammoRegenTimer` is decremented every frame and once it reached 0,
the `ammo` state is incremented the the `ammoRegenTimer` is reset.

	// ammoRegen increments ammo by AMMO_REGEN_AMOUNT but no more than AMMO_MAX.
	function ammoRegen(state: State, _: Input): State {
		if (state.ammoRegenTimer > 0) {
			const ammoRegenTimer = state.ammoRegenTimer - 1

			return {
				...state,
				ammoRegenTimer,
			}
		}

		return {
			...state,
			ammo: Math.min(AMMO_MAX, state.ammo + AMMO_REGEN_AMOUNT),
			ammoRegenTimer: AMMO_REGEN_TIMER,
		}
	}

This limits the maximum number of bullet in the state
solving the main problem making the game playable and responsive.
