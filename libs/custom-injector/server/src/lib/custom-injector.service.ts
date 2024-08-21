import { Injectable, Logger, Scope } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';

@Injectable()
export class CustomInjectorService {
	constructor(private readonly modulesContainer: ModulesContainer) {
		Logger.log('create', CustomInjectorService.name);
	}

	public getLastComponentByName<T>(token: string): T | null {
		const values = this.getComponentsByName<T>(token);
		if (values.length > 0) {
			return values[values.length - 1];
		}

		return null;
	}

	public getLastComponentsByClass<T>(cls: any): T | null {
		const objects = this.getComponentsByClass<T>(cls);
		if (objects.length > 0) {
			return objects[objects.length - 1];
		}

		return null;
	}

	public getComponentsByName<T>(token: string): T[] {
		const modulesMap = [...this.modulesContainer.entries()];

		return modulesMap
			.map(([, nestModule]: [string, Module]) => {
				const components = [...nestModule.providers.values()];

				return components
					.filter((component) => component.scope !== Scope.REQUEST && component.name === token)
					.map((component) => this.toDiscoveredClass<T>(nestModule, component));
			})
			.reduce((all, cur) => all.concat(cur), [])
			.reverse()
			.filter(Boolean);
	}

	public getComponentsByClass<T>(cls: any): T[] {
		const modulesMap = [...this.modulesContainer.entries()];

		return modulesMap
			.map(([, nestModule]: [string, Module]) => {
				const components = [...nestModule.providers.values()];

				return components
					.filter((component) => component.scope !== Scope.REQUEST)
					.map((component) => this.toDiscoveredClass<T>(nestModule, component))
					.filter((obj) => obj instanceof cls);
			})
			.reduce((all, cur) => all.concat(cur), [])
			.reverse()
			.filter(Boolean);
	}

	private toDiscoveredClass<T>(nestModule: Module, wrapper: InstanceWrapper): T {
		const instanceHost: {
			instance: T;
		} = wrapper.getInstanceByContextId(STATIC_CONTEXT, wrapper && wrapper.id ? wrapper.id : undefined);

		return instanceHost.instance;
	}
}
