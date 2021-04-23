# NGRX-COLOQUENT

Angular library mapping objects and their relations to [JSON:API](http://jsonapi.org), with a clean synthax for creating, retrieving, updating and deleting model objects. With objects polymorphism and lazy relation loading. Object Loading are done so that you will use a NGRX state for entities.

We also added a simple way to manage very simple NGRX State without creating a specific Reducer (Do not over use it also)

# Install

```shell
$ npm install --save ngrx-coloquent @Herlinus/Coloquent @ngrx/store @ngrx/effects @ngrx/entity
```
# Usage

## Importing package

You need to import the module `NgrxColoquentGlobalModule`. Don not forget to import and initiate a NGRX Store and effects root.

```javascript
@NgModule({
    imports: [
        StoreModule.forRoot(
            {},
            {
            runtimeChecks: {
                    strictStateImmutability: false,
                    strictActionImmutability: false,
                    strictStateSerializability: false,
                    strictActionSerializability: false
                }
            }
        ),
        EffectsModule.forRoot([]),
        NgrxColoquentGlobalModule
    ]
})
class AppModule {}
```

## Creating An Entity
A simple entity is a class you create that describe your model. It extends the class `Model` from the library `Ngrx-Coloquent`.

For example:

```javascript
import { Model } from 'ngrx-coloquent';

class Person extends Model {
    protected jsonApiType = 'Person';

    @Attribut('id') __id__: number;
    @Attribut() client_id: number;

    @toManyRelation(() => Address) addresses;
    @toOneRelation(() => Client) client;

    readOnlyAttributes = ['version'];
}
```
## Retrieving objects

To retrive Model, you can use a query builder like the one Coloquent uses.

For example:

```javascript
Identity.query$().where('client_id', 8009785).get().start();
```

If you need to change something when from your component or service after the loading is done, you can add some callback for success or failure

For example:

```javascript
Identity.query$().where('client_id', 88456257).get().onSuccess(() =>  console.log('done')).onError(() => console.error('not done'));
```

To load One object by id, you can directly start the loading from the model

```javascript
Identity.find$(id).start();
```

## Saving objects

To save Object you just need to call the method `Model.save$`.

For example:

```javascript
const identity = new Identity();
identity.save$().start();
```

## Polymorphism

For polymorphism, you just need to manage some inheritance for all model. And you also need to add some decorators.

```javascript
class Identity extends Model {
    protected jsonApiType = 'Identity';

    @Attribut('id') __id__: number;
    @Attribut('client') client: string;
}

@Identity.appendPolymorph('Person')
class Person extends Person {
    protected jsonApiType = 'Person';

    @Attribut('name') name: string;
}
```

## Selector to fetch data from the store state

To select objects from the NGRX Store, you need to call the method `Model.selectEntity$` and give as an argument a function that filter elements.
It returns an observable of all the filtered elements in the store. The state you get on the callback function is a id: entity mapping value.

For example:

```javascript
Person.selectEntity$(
    (state) => {
        return Object.values(state).filter(
            (entity) => entity.name !== 'Donald'
        );
    }
);
```

You cann add specific filter from any observable (and other state too) to filter it. You just need to add a list of the observable of the data you need for the filter as second argument.

For example:

```javascript
const minValueSubject = new BehaviorSubject<number>(0);

Bill.selectEntity$(
    (state, minValue) => {
        return Object.values(state).filter(
            bill => bill.total >= minValue
        );
    },
    [
        minValueSubject.asObservable()
    ]
);
```

No need to specify that all change from the Observable will change the selector result automatically.

You need to wisely choose which entity model to use to select entities from polymorphic models because a type filter is automatically done so you only get Model that match the actual type.

Lets consider these three models.

```javascript
class Identity extends Model {
    protected jsonApiType = 'Identity';

    @Attribut() department: string;
}

@Identity.appendPolymorph('Person')
class Person extends Identity {
    protected jsonApiType = 'Person';

    @Attribut() name: string;

}

@Identity.appendPolymorph('Comapny')
class Company extends Identity {
    protected jsonApiType = 'Comapny';

    @Attribut() title: string;
}
```

As you can see `Person` and `Company` are both `Identity`.

If you create a selector from the class `Person`, you will only get all entities of type `Person` on your selector, no `Company` or `Identity` will be there.
It's the same for a selector from the class `Company`, only `Company` entities will be there.
But if you make a selector from the class `Identity`, you will get Entities from both `Identity` type, `Person` type and `Company` type.

For example:

```javascript
// you will get all entities
Identity.selectEntity$(
    (state) => Object.values(state)
);

// you will get all Person
Person.selectEntity$(
    (state) => Object.values(state)
);
```